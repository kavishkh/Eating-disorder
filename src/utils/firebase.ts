
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAF1Swurg_GF5n6HKbvySocD7nNogrWDQ8",
  authDomain: "recovery-journey-e950b.firebaseapp.com",
  projectId: "recovery-journey-e950b",
  storageBucket: "recovery-journey-e950b.appspot.com",
  messagingSenderId: "312698346068",
  appId: "1:312698346068:web:d35ff0ebefe7597564ebc1",
  measurementId: "G-CZKZQTV96F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
let analytics;
try {
  analytics = getAnalytics(app);
} catch (error) {
  // Analytics may not be available in all environments
  console.log("Analytics not initialized:", error);
}

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Enable Firebase Auth log debugging in development
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase Auth debugging enabled');
}

export { app, analytics, db, auth, storage };
