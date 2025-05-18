
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from 'uuid';

// Initial data setup
export const initializeWeddingData = async () => {
  try {
    const docRef = doc(db, "weddingData", "settings");
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        theme: {
          primary: "#8B0000", // wedding-maroon
          secondary: "#D4AF37", // wedding-gold
          accent: "#FDF8F0", // wedding-soft-cream
          background: "#FFFFFF",
          text: "#333333"
        },
        venue: {
          name: "Wedding Venue",
          address: "Kochi, Kerala",
          mapsUrl: "https://maps.app.goo.gl/tQCb8FZ4Cjnag58i6"
        },
        details: {
          groomName: "Aswin",
          brideName: "Priya",
          weddingDate: "December 25, 2024",
          story: "Our love story began when we met at a coffee shop..."
        }
      });
      
      // Initialize default timeline events
      const timelineRef = collection(db, "timeline");
      const defaultEvents = [
        {
          id: uuidv4(),
          title: "Ceremony",
          time: "10:00 AM",
          description: "Main wedding ceremony at the venue",
          order: 0
        },
        {
          id: uuidv4(),
          title: "Reception",
          time: "6:00 PM",
          description: "Dinner and celebrations",
          order: 1
        }
      ];
      
      for (const event of defaultEvents) {
        await setDoc(doc(timelineRef, event.id), event);
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error initializing wedding data:", error);
    throw error;
  }
};

// Need to add missing imports
import { collection } from "firebase/firestore";
