
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WeddingDetails } from "./types";

// Wedding details management
export const getWeddingDetails = async (): Promise<WeddingDetails> => {
  try {
    const docRef = doc(db, "weddingData", "settings");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().details) {
      return docSnap.data().details as WeddingDetails;
    } else {
      throw new Error("Wedding details not found");
    }
  } catch (error) {
    console.error("Error getting wedding details:", error);
    throw error;
  }
};

export const updateWeddingDetails = async (details: WeddingDetails): Promise<void> => {
  try {
    const docRef = doc(db, "weddingData", "settings");
    await updateDoc(docRef, { details });
  } catch (error) {
    console.error("Error updating wedding details:", error);
    throw error;
  }
};
