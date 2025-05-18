
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration - using a demo configuration for the wedding website
const firebaseConfig = {
  apiKey: "AIzaSyCfBrKQZ0AO9dGLlr6hSdPtJ6A8N-iQBIE",
  authDomain: "wedding-site-demo-2024.firebaseapp.com", 
  projectId: "wedding-site-demo-2024",
  storageBucket: "wedding-site-demo-2024.appspot.com",
  messagingSenderId: "265478932133",
  appId: "1:265478932133:web:8fb397dc9f7b012345a6b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence for Firestore (so the app works even with temporary connection issues)
import { enableIndexedDbPersistence } from "firebase/firestore";

try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required for persistence
      console.log('Persistence not available in this browser');
    }
  });
} catch (err) {
  console.log('Error enabling persistence:', err);
}

export default app;
