
import { collection, doc, setDoc, updateDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db, isOffline, getDemoData } from "@/lib/firebase";
import { v4 as uuidv4 } from 'uuid';
import { TimelineEvent } from "./types";

// Store timeline locally when offline
const localStorageKey = "wedding_timeline_offline";

const getLocalTimeline = (): TimelineEvent[] => {
  const saved = localStorage.getItem(localStorageKey);
  return saved ? JSON.parse(saved) : [];
};

const saveLocalTimeline = (events: TimelineEvent[]) => {
  localStorage.setItem(localStorageKey, JSON.stringify(events));
};

// Timeline Event Management
export const getTimelineEvents = async (): Promise<TimelineEvent[]> => {
  try {
    // If offline, return local storage data first
    if (isOffline()) {
      const localEvents = getLocalTimeline();
      if (localEvents.length > 0) {
        return localEvents;
      }
      // Fall back to demo data
      return getDemoData('timeline') as TimelineEvent[];
    }
    
    const querySnapshot = await getDocs(collection(db, "timeline"));
    const events: TimelineEvent[] = [];
    
    querySnapshot.forEach((doc) => {
      const eventData = doc.data() as TimelineEvent;
      eventData.id = doc.id;
      events.push(eventData);
    });
    
    // Save to local storage for offline use
    saveLocalTimeline(events);
    
    // Sort by order
    return events.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error getting timeline events:", error);
    
    // Fall back to local storage if Firebase fails
    const localEvents = getLocalTimeline();
    if (localEvents.length > 0) {
      return localEvents;
    }
    
    // Fall back to demo data
    return getDemoData('timeline') as TimelineEvent[];
  }
};

export const addTimelineEvent = async (event: Omit<TimelineEvent, 'id'>): Promise<TimelineEvent> => {
  try {
    const id = uuidv4();
    const eventData = { ...event, id };
    
    // If offline, store in local storage only
    if (isOffline()) {
      const localEvents = getLocalTimeline();
      saveLocalTimeline([...localEvents, eventData]);
      return eventData;
    }
    
    await setDoc(doc(db, "timeline", id), eventData);
    
    // Update local storage with the new event
    const localEvents = getLocalTimeline();
    saveLocalTimeline([...localEvents, eventData]);
    
    return eventData;
  } catch (error) {
    console.error("Error adding timeline event:", error);
    throw error;
  }
};

export const updateTimelineEvent = async (event: TimelineEvent): Promise<void> => {
  try {
    // Update local storage regardless of online status
    const localEvents = getLocalTimeline();
    const updatedEvents = localEvents.map(e => 
      e.id === event.id ? event : e
    );
    saveLocalTimeline(updatedEvents);
    
    if (isOffline()) {
      // For offline mode, we just update local storage
      return;
    }
    
    await updateDoc(doc(db, "timeline", event.id), { ...event });
  } catch (error) {
    console.error("Error updating timeline event:", error);
    throw error;
  }
};

export const deleteTimelineEvent = async (eventId: string): Promise<void> => {
  try {
    // Update local storage regardless of online status
    const localEvents = getLocalTimeline();
    saveLocalTimeline(localEvents.filter(e => e.id !== eventId));
    
    if (isOffline()) {
      // For offline mode, we just update local storage
      return;
    }
    
    await deleteDoc(doc(db, "timeline", eventId));
  } catch (error) {
    console.error("Error deleting timeline event:", error);
    throw error;
  }
};

export const updateTimelineOrder = async (events: TimelineEvent[]): Promise<void> => {
  try {
    // Update local storage regardless of online status
    saveLocalTimeline(events);
    
    if (isOffline()) {
      // For offline mode, we just update local storage
      return;
    }
    
    // Update each event with its new order
    const updatePromises = events.map((event, index) => {
      return updateDoc(doc(db, "timeline", event.id), { order: index });
    });
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error updating timeline order:", error);
    throw error;
  }
};
