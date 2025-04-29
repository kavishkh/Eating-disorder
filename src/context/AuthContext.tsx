import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { onNetworkStatusChange, getNetworkStatus } from "../utils/firebase";
import { syncLocalEntriesWithFirebase } from "../services/moodService";
import { User as AppUser } from "@/types/types";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  error: Error | null;
  isOnline: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
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

// Helper function to convert Firebase user to our User type
const formatUser = async (firebaseUser: FirebaseUser): Promise<AppUser> => {
  try {
    // Check if we're online before trying to fetch from Firestore
    if (!getNetworkStatus()) {
      // If offline, return basic user info from Firebase Auth
      console.log("Offline: Using basic user info from Firebase Auth");
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || "",
        onboardingCompleted: false, // Safe default when offline
        registrationDate: new Date(),
        lastActivity: new Date().toISOString(),
        moodEntries: 0,
        progressMetrics: {
          completedGoals: 0,
          totalGoals: 0,
          streakDays: 0,
          lastActiveDate: new Date().toISOString()
        }
      };
    }
    
    // If online, try to get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("User data from Firestore:", userData);
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || userData.name,
        disorder: userData.disorder,
        goals: userData.goals || [],
        onboardingCompleted: userData.onboardingCompleted || false,
        registrationDate: userData.createdAt ? new Date(userData.createdAt) : new Date(),
        lastActivity: userData.lastActivity || new Date().toISOString(),
        moodEntries: userData.moodEntries || 0,
        progressMetrics: userData.progressMetrics || {
          completedGoals: 0,
          totalGoals: 0,
          streakDays: 0,
          lastActiveDate: new Date().toISOString()
        }
      };
    }
    
    // First time user or document doesn't exist yet
    console.log("No user document exists yet, returning basic user");
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || "",
      onboardingCompleted: false,
      registrationDate: new Date(),
      lastActivity: new Date().toISOString(),
      moodEntries: 0,
      progressMetrics: {
        completedGoals: 0,
        totalGoals: 0,
        streakDays: 0,
        lastActiveDate: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Error formatting user:", error);
    // Return a basic user object if there's an error
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || "",
      onboardingCompleted: false,
      registrationDate: new Date(),
      lastActivity: new Date().toISOString(),
      moodEntries: 0,
      progressMetrics: {
        completedGoals: 0,
        totalGoals: 0,
        streakDays: 0,
        lastActiveDate: new Date().toISOString()
      }
    };
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOnline, setIsOnline] = useState(getNetworkStatus());
  const { toast } = useToast();

  // Subscribe to network status changes
  useEffect(() => {
    const unsubscribe = onNetworkStatusChange((online) => {
      setIsOnline(online);
      if (online) {
        toast({
          title: "You're back online",
          description: "Connected to our servers"
        });
      } else {
        toast({
          title: "You're offline",
          description: "Some features may be limited",
          variant: "destructive"
        });
      }
    });
    
    return unsubscribe;
  }, [toast]);

  useEffect(() => {
    console.log("Setting up auth state listener");
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setError(null);
      try {
        if (firebaseUser) {
          console.log("User is signed in:", firebaseUser.uid);
          const formattedUser = await formatUser(firebaseUser);
          console.log("Formatted user:", formattedUser);
          setCurrentUser(formattedUser);
          
          // Only try these operations if we're online
          if (isOnline) {
            // Sync any local mood entries to Firebase
            await syncLocalEntriesWithFirebase(firebaseUser.uid);
            
            // Update last activity timestamp
            try {
              const userRef = doc(db, "users", firebaseUser.uid);
              await updateDoc(userRef, {
                lastActivity: new Date().toISOString()
              }).catch(err => {
                console.log("Error updating last activity - document may not exist yet:", err);
                // Create document if it doesn't exist
                return setDoc(userRef, {
                  email: firebaseUser.email,
                  name: firebaseUser.displayName,
                  lastActivity: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                  onboardingCompleted: false
                });
              });
            } catch (err) {
              console.error("Error updating user document:", err);
              // Non-fatal error, continue with auth
            }
          }
        } else {
          console.log("User is signed out");
          setCurrentUser(null);
        }
      } catch (err: any) {
        console.error("Auth state change error:", err);
        setCurrentUser(null);
        setError(err);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return unsubscribe;
  }, [isOnline]);

  // Firebase login
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isOnline) {
        throw new Error("You're offline. Please check your internet connection and try again.");
      }
      
      console.log("Attempting login for:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const formattedUser = await formatUser(userCredential.user);
      
      // Sync local mood entries with Firestore
      await syncLocalEntriesWithFirebase(userCredential.user.uid);
      
      setCurrentUser(formattedUser);
      console.log("Login successful for:", email);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Firebase register
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isOnline) {
        throw new Error("You're offline. Please check your internet connection and try again.");
      }
      
      console.log("Attempting to create user:", email);
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("User created, updating profile for:", user.uid);
      // Update the user's display name
      await updateProfile(user, { displayName: name });
      
      console.log("Creating Firestore document for user:", user.uid);
      // Create a user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        name,
        onboardingCompleted: false,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        moodEntries: 0,
        progressMetrics: {
          completedGoals: 0,
          totalGoals: 0,
          streakDays: 0,
          lastActiveDate: new Date().toISOString()
        }
      });
      
      const formattedUser = await formatUser(user);
      setCurrentUser(formattedUser);
      console.log("Registration successful for:", email);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Firebase logout
  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
      setCurrentUser(null);
      console.log("User signed out successfully");
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err);
    }
  };

  // Update user profile in both Firebase Auth and Firestore
  const updateUserProfile = async (data: Partial<AppUser>) => {
    if (!currentUser) {
      console.error("Cannot update profile: No current user");
      throw new Error("No authenticated user found");
    }
    
    setError(null);
    
    // Store the update locally regardless of online status
    setCurrentUser(prev => {
      if (!prev) return null;
      return { ...prev, ...data };
    });
    
    // If offline, store the update to be applied later
    if (!isOnline) {
      console.log("Offline: Storing profile update for later sync", data);
      
      try {
        // Save to localStorage for later sync
        const pendingUpdates = JSON.parse(localStorage.getItem('pendingProfileUpdates') || '[]');
        pendingUpdates.push({
          userId: currentUser.id,
          data,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('pendingProfileUpdates', JSON.stringify(pendingUpdates));
        
        // Also store critical onboarding data separately
        if (data.onboardingCompleted) {
          localStorage.setItem('userOnboardingComplete', 'true');
        }
        if (data.disorder) {
          localStorage.setItem('userDisorder', data.disorder);
        }
        if (data.goals) {
          localStorage.setItem('userGoals', JSON.stringify(data.goals));
        }
        
        return;
      } catch (err) {
        console.error("Error storing offline profile update:", err);
        // Continue with the function, it might still work online
      }
    }
    
    try {
      console.log("Updating user profile with data:", data);
      
      // Update display name in Firebase Auth if provided
      if (data.name && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: data.name });
      }
      
      // Update Firestore document
      const userRef = doc(db, "users", currentUser.id);
      
      // Check if document exists first
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        console.log("Document exists, updating with:", data);
        await updateDoc(userRef, { ...data });
        console.log("User document updated successfully");
      } else {
        // Create the document if it doesn't exist
        console.log("Document doesn't exist, creating new document with:", {
          email: currentUser.email,
          name: currentUser.name,
          ...data
        });
        
        await setDoc(userRef, {
          email: currentUser.email,
          name: currentUser.name,
          ...data,
          createdAt: currentUser.registrationDate?.toISOString() || new Date().toISOString(),
          lastActivity: new Date().toISOString()
        });
        console.log("User document created successfully");
      }
      
      console.log("User state updated successfully");
    } catch (err: any) {
      console.error("Error updating user profile:", err);
      setError(err);
      // Don't throw here - we've already updated the local state
      // Just notify the user with toast
      toast({
        title: "Offline mode",
        description: "Your changes are saved locally and will sync when you're back online.",
        variant: "default"
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
