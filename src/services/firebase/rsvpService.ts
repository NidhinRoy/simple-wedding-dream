
import { collection, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from 'uuid';
import { GuestRSVP } from "./types";

// RSVP Management
export const getRSVPs = async (): Promise<GuestRSVP[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "rsvps"));
    const rsvps: GuestRSVP[] = [];
    
    querySnapshot.forEach((doc) => {
      const rsvpData = doc.data() as GuestRSVP;
      rsvpData.id = doc.id;
      rsvps.push(rsvpData);
    });
    
    // Sort by timestamp, most recent first
    return rsvps.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error getting RSVPs:", error);
    throw error;
  }
};

export const submitRSVP = async (rsvp: Omit<GuestRSVP, 'id' | 'timestamp'>): Promise<GuestRSVP> => {
  try {
    const id = uuidv4();
    const timestamp = Date.now();
    const rsvpData: GuestRSVP = { ...rsvp, id, timestamp };
    
    await setDoc(doc(db, "rsvps", id), rsvpData);
    return rsvpData;
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    throw error;
  }
};

export const deleteRSVP = async (rsvpId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "rsvps", rsvpId));
  } catch (error) {
    console.error("Error deleting RSVP:", error);
    throw error;
  }
};
