import React, { createContext, useContext, useState, useEffect } from "react";
import { User as AppUser } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import { authAPI, setAuthToken, removeAuthToken } from "@/utils/api";

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  error: Error | null;
  isOnline: boolean;
  login: (email: string, password: string) => Promise<AppUser | null>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<AppUser | null>;
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
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const user = await authAPI.getCurrentUser();
        setCurrentUser(user);

        // Cache user data
        localStorage.setItem('cachedUser', JSON.stringify(user));
        localStorage.setItem('userOnboardingComplete', user.onboardingCompleted ? 'true' : 'false');
      } catch (err) {
        console.error('Failed to get current user:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [isOnline]);

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

      localStorage.setItem("token", res.token);
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
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        throw new Error("You're offline. Please check your internet connection and try again.");
      }

      console.log("Attempting to create user:", email);
      const user = await authAPI.register(email, password, name);

      setCurrentUser(user);
      console.log("Registration successful for:", email);

      setLoading(false);

      // New users always need to complete onboarding
      window.location.href = "/onboarding";
      return;
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        throw new Error("You're offline. Please check your internet connection and try again.");
      }

      // Load Google Sign-In library
      const google = (window as any).google;
      if (!google) {
        throw new Error("Google Sign-In library not loaded");
      }

      return new Promise<AppUser | null>((resolve, reject) => {
        google.accounts.id.initialize({
          client_id: "312698346068-your-client-id.apps.googleusercontent.com", // Replace with your actual client ID
          callback: async (response: any) => {
            try {
              // Decode the JWT token to get user info
              const payload = JSON.parse(atob(response.credential.split('.')[1]));

              const user = await authAPI.loginWithGoogle(
                payload.email,
                payload.name,
                payload.sub // Google user ID
              );

              setCurrentUser(user);

              // Cache user data
              localStorage.setItem('cachedUser', JSON.stringify(user));
              localStorage.setItem('userOnboardingComplete', user.onboardingCompleted ? 'true' : 'false');

              console.log("Google login successful");
              setLoading(false);
              resolve(user);
            } catch (err: any) {
              console.error("Google login error:", err);
              setError(err);
              setLoading(false);
              reject(err);
            }
          },
        });

        google.accounts.id.prompt(); // Show the One Tap dialog
      });
    } catch (err: any) {
      console.error("Google login initialization error:", err);
      setError(err);
      setLoading(false);
      throw err;
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
    loginWithGoogle,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
