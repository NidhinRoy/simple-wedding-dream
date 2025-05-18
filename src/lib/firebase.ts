
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration - using a demo configuration for the wedding website
// Note: For demonstration purposes only, using a public demo Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyDaLmLo7HMVOfmfMn5eHO5QbzVrTLXAeX0",
  authDomain: "wedding-demo-app-2025.firebaseapp.com",
  projectId: "wedding-demo-app-2025",
  storageBucket: "wedding-demo-app-2025.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:1234567890abcdef123456"
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
