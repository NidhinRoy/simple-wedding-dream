
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration - using a demo configuration for the wedding website
const firebaseConfig = {
  apiKey: "AIzaSyDwXmzJ2JQNbfPwRGZi9pJ5XJrSNfBIvuQ",
  authDomain: "wedding-site-demo-f433d.firebaseapp.com", 
  projectId: "wedding-site-demo-f433d",
  storageBucket: "wedding-site-demo-f433d.appspot.com",
  messagingSenderId: "553951277175",
  appId: "1:553951277175:web:9e836323edc6ed05f54503"
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
