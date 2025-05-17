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
