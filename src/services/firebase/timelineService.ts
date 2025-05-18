
import { collection, doc, setDoc, updateDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from 'uuid';
import { TimelineEvent } from "./types";

// Timeline Event Management
export const getTimelineEvents = async (): Promise<TimelineEvent[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "timeline"));
    const events: TimelineEvent[] = [];
    
    querySnapshot.forEach((doc) => {
      const eventData = doc.data() as TimelineEvent;
      eventData.id = doc.id;
      events.push(eventData);
    });
    
    // Sort by order
    return events.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error getting timeline events:", error);
    throw error;
  }
};

export const addTimelineEvent = async (event: Omit<TimelineEvent, 'id'>): Promise<TimelineEvent> => {
  try {
    const id = uuidv4();
    const eventData = { ...event, id };
    await setDoc(doc(db, "timeline", id), eventData);
    return eventData;
  } catch (error) {
    console.error("Error adding timeline event:", error);
    throw error;
  }
};

export const updateTimelineEvent = async (event: TimelineEvent): Promise<void> => {
  try {
    await updateDoc(doc(db, "timeline", event.id), { ...event });
  } catch (error) {
    console.error("Error updating timeline event:", error);
    throw error;
  }
};

export const deleteTimelineEvent = async (eventId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "timeline", eventId));
  } catch (error) {
    console.error("Error deleting timeline event:", error);
    throw error;
  }
};

export const updateTimelineOrder = async (events: TimelineEvent[]): Promise<void> => {
  try {
    const updatePromises = events.map((event, index) => {
      return updateDoc(doc(db, "timeline", event.id), { order: index });
    });
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error updating timeline order:", error);
    throw error;
  }
};
