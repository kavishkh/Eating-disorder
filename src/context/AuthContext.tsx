
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
import { auth, db } from "../utils/firebase";
import { syncLocalEntriesWithFirebase } from "../services/moodService";
import { User as AppUser } from "@/types/types";

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  error: Error | null;
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
    // Check if user has a document in Firestore
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
    
    console.log("No user document exists yet, returning basic user");
    // If no document exists yet, return basic user
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
    };
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
          
          // Sync any local mood entries to Firebase
          await syncLocalEntriesWithFirebase(firebaseUser.uid);
          
          // Update last activity timestamp
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
  }, []);

  // Firebase login
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
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
    if (!currentUser) return;
    setError(null);
    
    try {
      console.log("Updating user profile with data:", data);
      // Update Firestore document
      const userRef = doc(db, "users", currentUser.id);
      
      // Check if document exists first
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        await updateDoc(userRef, { ...data });
        console.log("User document updated successfully");
      } else {
        // Create the document if it doesn't exist
        await setDoc(userRef, {
          email: currentUser.email,
          name: currentUser.name,
          ...data,
          createdAt: currentUser.registrationDate?.toISOString() || new Date().toISOString(),
          lastActivity: new Date().toISOString()
        });
        console.log("User document created successfully");
      }
      
      // Update display name in Firebase Auth if provided
      if (data.name && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: data.name });
      }
      
      // Update local state
      setCurrentUser(prev => {
        if (!prev) return null;
        const updated = { ...prev, ...data };
        console.log("Updated user state:", updated);
        return updated;
      });
      console.log("User state updated successfully");
    } catch (err: any) {
      console.error("Error updating user profile:", err);
      setError(err);
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
