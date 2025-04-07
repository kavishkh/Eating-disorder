
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { UserProfile } from '@/types';

interface User {
  id: string;
  name: string;
  email: string;
  isOnboarded: boolean;
  gender?: UserProfile['gender'];
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string, gender?: UserProfile['gender']) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from local storage
    const storedUser = localStorage.getItem('mindfulUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, gender?: UserProfile['gender']) => {
    setLoading(true);
    try {
      // Mock API call - would be replaced with actual authentication API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data
      const user: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        isOnboarded: false,
        gender,
      };
      
      setCurrentUser(user);
      localStorage.setItem('mindfulUser', JSON.stringify(user));
      toast.success("Successfully logged in!");
    } catch (error) {
      toast.error("Failed to login. Please check your credentials.");
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Mock API call - would be replaced with actual registration API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user creation
      const user: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        isOnboarded: false,
      };
      
      setCurrentUser(user);
      localStorage.setItem('mindfulUser', JSON.stringify(user));
      toast.success("Account successfully created!");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      throw new Error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mindfulUser');
    toast.info("You've been logged out");
  };

  const updateUser = (userData: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      localStorage.setItem('mindfulUser', JSON.stringify(updatedUser));
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
