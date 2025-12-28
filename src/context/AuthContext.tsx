import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User as AppUser } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import { authAPI, removeAuthToken, onAuthExpired } from "@/utils/api";
import { isTokenExpired, debugToken, getToken } from "@/utils/tokenHelper";

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  error: Error | null;
  isOnline: boolean;
  login: (email: string, password: string) => Promise<AppUser | null>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<AppUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  // Handle auth expiration - called when 401 errors occur or token expires
  const handleAuthExpired = useCallback(() => {
    console.log("🔒 Auth expired, clearing user state and redirecting...");

    setCurrentUser(null);
    setError(null);

    // Show toast notification
    toast({
      title: "Session Expired",
      description: "Your session has expired. Please log in again.",
      variant: "destructive"
    });

    // Redirect to login page
    window.location.href = '/login';
  }, [toast]);

  // Register the auth expired callback with the API module
  useEffect(() => {
    onAuthExpired(handleAuthExpired);
  }, [handleAuthExpired]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "You're back online",
        description: "Connected to our servers"
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Some features may be limited",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Check for existing auth token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();

      if (!token) {
        // No token found - user needs to login (this is normal, not an error)
        setLoading(false);
        return;
      }

      // Debug: Log token info on startup
      console.log("🔐 Token found, validating...");
      debugToken();

      // Pre-check: Is the token already expired?
      if (isTokenExpired(token)) {
        console.warn("🔒 Token is expired, clearing auth state");
        localStorage.removeItem('token');
        localStorage.removeItem('cachedUser');
        setLoading(false);

        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        });
        return;
      }

      try {
        console.log("Found valid token, fetching current user...");
        const user = await authAPI.getCurrentUser();
        console.log("Current user fetched:", user);
        setCurrentUser(user);

        // Cache user data
        localStorage.setItem('cachedUser', JSON.stringify(user));
        localStorage.setItem('userOnboardingComplete', user.onboardingCompleted ? 'true' : 'false');
      } catch (err) {
        console.error('Failed to get current user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('cachedUser');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [toast]);

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        throw new Error("You're offline. Please check your internet connection and try again.");
      }

      console.log("Attempting login for:", email);
      const res = await authAPI.login(email, password);

      console.log("Login response:", res);

      // Token is already set by authAPI.login
      const user = res.user;
      setCurrentUser(user);

      // Cache user data
      localStorage.setItem('cachedUser', JSON.stringify(user));
      localStorage.setItem('userOnboardingComplete', user.onboardingCompleted ? 'true' : 'false');

      console.log("Login successful for:", email);
      return user;
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        throw new Error("You're offline. Please check your internet connection and try again.");
      }

      console.log("Attempting to register user:", { name, email });
      const user = await authAPI.register(name, email, password);

      console.log("Registration response user:", user);
      setCurrentUser(user);

      // Cache user data
      localStorage.setItem('cachedUser', JSON.stringify(user));

      console.log("Registration successful for:", email);
      setLoading(false);

      return;
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setError(null);
    try {
      authAPI.logout();
      setCurrentUser(null);

      // Clear cached data
      localStorage.removeItem('cachedUser');
      localStorage.removeItem('userOnboardingComplete');
      localStorage.removeItem('token');

      console.log("User signed out successfully");
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err);
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<AppUser>) => {
    if (!currentUser) {
      console.error("Cannot update profile: No current user");
      throw new Error("No authenticated user found");
    }

    setError(null);

    // Update local state immediately for better UX
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };

      // Cache the updated user
      localStorage.setItem('cachedUser', JSON.stringify(updated));
      if (data.onboardingCompleted !== undefined) {
        localStorage.setItem('userOnboardingComplete', data.onboardingCompleted ? 'true' : 'false');
      }

      return updated;
    });

    // If offline, store the update for later sync
    if (!isOnline) {
      console.log("Offline: Storing profile update for later sync", data);

      try {
        const pendingUpdates = JSON.parse(localStorage.getItem('pendingProfileUpdates') || '[]');
        pendingUpdates.push({
          userId: currentUser.id,
          data,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('pendingProfileUpdates', JSON.stringify(pendingUpdates));

        toast({
          title: "Offline mode",
          description: "Your changes are saved locally and will sync when you're back online.",
          variant: "default"
        });

        return;
      } catch (err) {
        console.error("Error storing offline profile update:", err);
      }
    }

    try {
      console.log("Updating user profile with data:", data);
      const updatedUser = await authAPI.updateProfile(data);
      setCurrentUser(updatedUser);

      // Update cache
      localStorage.setItem('cachedUser', JSON.stringify(updatedUser));

      console.log("User profile updated successfully");
    } catch (err: any) {
      console.error("Error updating user profile:", err);
      setError(err);

      toast({
        title: "Update failed",
        description: "Failed to update profile. Your changes are saved locally.",
        variant: "destructive"
      });
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    isOnline,
    login,
    register,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
