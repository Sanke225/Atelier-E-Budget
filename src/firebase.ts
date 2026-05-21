// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAwYkjQiLO9FgzVx9vfFMAQyWYhTYKVIyI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "e-budget-77ab0.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://e-budget-77ab0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "e-budget-77ab0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "e-budget-77ab0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "19809884713",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:19809884713:web:0b59a14a507c5aacbd1a38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app)
export const storage = getStorage(app)