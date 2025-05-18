
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { VenueInfo } from "./types";

// Venue/Location management
export const getVenueInfo = async (): Promise<VenueInfo> => {
  try {
    const docRef = doc(db, "weddingData", "settings");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().venue) {
      return docSnap.data().venue as VenueInfo;
    } else {
      throw new Error("Venue data not found");
    }
  } catch (error) {
    console.error("Error getting venue info:", error);
    throw error;
  }
};

export const updateVenueInfo = async (venue: VenueInfo): Promise<void> => {
  try {
    const docRef = doc(db, "weddingData", "settings");
    await updateDoc(docRef, { venue });
  } catch (error) {
    console.error("Error updating venue info:", error);
    throw error;
  }
};
