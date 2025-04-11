
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
  disorderType?: string;
  goals?: string[];
  onboardingCompleted?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Mock login functionality
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // This is a mock implementation - in a real app, this would be an API call
      // For demo purposes, we'll just create a mock user
      if (email && password) {
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          onboardingCompleted: false
        };
        
        setCurrentUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock register functionality
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    
    try {
      // This is a mock implementation - in a real app, this would be an API call
      if (email && password && name) {
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          onboardingCompleted: false
        };
        
        setCurrentUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        throw new Error("Invalid registration data");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout functionality
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  // Update user profile
  const updateUserProfile = (data: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
