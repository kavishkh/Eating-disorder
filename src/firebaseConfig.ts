import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Optional

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual config values
// Consider using environment variables for security: https://vitejs.dev/guide/env-and-mode.html
const firebaseConfig = {
  apiKey: "AIzaSyAF1Swurg_GF5n6HKbvySocD7nNogrWDQ8",
  authDomain: "recovery-journey-e950b.firebaseapp.com",
  projectId: "recovery-journey-e950b",
  storageBucket: "recovery-journey-e950b.firebasestorage.app",
  messagingSenderId: "312698346068",
  appId: "1:312698346068:web:d35ff0ebefe7597564ebc1",
  measurementId: "G-CZKZQTV96F",
  // Optional: Replace with your actual measurement ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app); // Optional

export { app, auth, db }; 