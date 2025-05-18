
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
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

// Enable improved offline persistence for Firestore (works better with multiple tabs)
try {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
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

// Enable local storage fallback for offline functionality
export const isOffline = () => !navigator.onLine;

export const getDemoData = (type: string) => {
  // Demo data for offline mode or when Firebase connection fails
  const demoData = {
    photos: [
      {
        id: 'demo-1',
        src: '/lovable-uploads/b3d92506-d627-4cbe-85a2-4162089d3dff.png',
        alt: 'Wedding couple at ceremony',
        order: 0
      },
      {
        id: 'demo-2',
        src: '/lovable-uploads/a7e97d44-2d65-4a6d-817e-382f9c5fd284.png',
        alt: 'Ring exchange moment',
        order: 1
      },
      {
        id: 'demo-3',
        src: '/lovable-uploads/a63255d5-5d0d-4b63-bf6e-67d3db27e43d.png',
        alt: 'First dance',
        order: 2
      }
    ],
    timeline: [
      {
        id: 'timeline-1',
        title: 'Wedding Ceremony',
        time: '12:00 PM',
        description: 'Join us as we exchange vows',
        order: 0
      },
      {
        id: 'timeline-2',
        title: 'Reception',
        time: '2:00 PM',
        description: 'Celebrate our union with food and dancing',
        order: 1
      }
    ]
  };
  
  return demoData[type as keyof typeof demoData] || [];
};

export default app;
