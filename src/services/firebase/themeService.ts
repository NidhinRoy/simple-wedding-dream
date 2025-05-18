
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ThemeColors } from "./types";

// Theme management
export const getTheme = async (): Promise<ThemeColors> => {
  try {
    const docRef = doc(db, "weddingData", "settings");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().theme) {
      return docSnap.data().theme as ThemeColors;
    } else {
      throw new Error("Theme data not found");
    }
  } catch (error) {
    console.error("Error getting theme:", error);
    throw error;
  }
};

export const updateTheme = async (theme: ThemeColors): Promise<void> => {
  try {
    const docRef = doc(db, "weddingData", "settings");
    await updateDoc(docRef, { theme });
  } catch (error) {
    console.error("Error updating theme:", error);
    throw error;
  }
};
