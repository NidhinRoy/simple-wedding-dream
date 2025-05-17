
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  getDocs,
  deleteDoc
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll
} from "firebase/storage";
import { db, storage } from "../lib/firebase";
import { v4 as uuidv4 } from 'uuid';

// Types
export interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  order?: number;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface VenueInfo {
  name: string;
  address: string;
  mapsUrl: string;
}

export interface WeddingDetails {
  groomName: string;
  brideName: string;
  weddingDate: string;
  story: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  time: string;
  description: string;
  order: number;
}

export interface GuestRSVP {
  id: string;
  name: string;
  email: string;
  attending: boolean;
  plusOne: boolean;
  dietaryRestrictions: string;
  message: string;
  timestamp: number;
}

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

// Photo management
export const getPhotos = async (): Promise<PhotoItem[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "photos"));
    const photos: PhotoItem[] = [];
    
    querySnapshot.forEach((doc) => {
      const photoData = doc.data() as PhotoItem;
      photoData.id = doc.id;
      photos.push(photoData);
    });
    
    // Sort by order if available
    return photos.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return 0;
    });
  } catch (error) {
    console.error("Error getting photos:", error);
    throw error;
  }
};

export const uploadPhoto = async (file: File, alt: string): Promise<PhotoItem> => {
  try {
    const id = uuidv4();
    const storageRef = ref(storage, `gallery/${id}`);
    
    // Upload to Firebase Storage
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    // Get current photos to determine the next order
    const photos = await getPhotos();
    const order = photos.length > 0 ? 
      Math.max(...photos.map(p => p.order !== undefined ? p.order : 0)) + 1 : 0;
    
    // Store metadata in Firestore
    const photoData: PhotoItem = {
      id,
      src: downloadURL,
      alt,
      order
    };
    
    await setDoc(doc(db, "photos", id), photoData);
    return photoData;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};

export const deletePhoto = async (photoId: string): Promise<void> => {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, "photos", photoId));
    
    // Delete from Storage
    const storageRef = ref(storage, `gallery/${photoId}`);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting photo:", error);
    throw error;
  }
};

export const updatePhotoOrder = async (photos: PhotoItem[]): Promise<void> => {
  try {
    // Update each photo with its new order
    const updatePromises = photos.map((photo, index) => {
      return updateDoc(doc(db, "photos", photo.id), { order: index });
    });
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error updating photo order:", error);
    throw error;
  }
};

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
