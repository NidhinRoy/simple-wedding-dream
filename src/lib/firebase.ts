
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAx_otx7vzPXpo8uTqB3nXO_NTFZ9hid4o",
  authDomain: "wedding-website-demo.firebaseapp.com",
  projectId: "wedding-website-demo",
  storageBucket: "wedding-website-demo.appspot.com",
  messagingSenderId: "270374111198",
  appId: "1:270374111198:web:dbb620c41960169a7e0f85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
