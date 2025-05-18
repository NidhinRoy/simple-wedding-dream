
import { collection, doc, getDoc, setDoc, updateDoc, getDocs, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage, isOffline, getDemoData } from "@/lib/firebase";
import { v4 as uuidv4 } from 'uuid';
import { PhotoItem } from "./types";

// Store uploads locally when offline
const localStorageKey = "wedding_photos_offline";

const getLocalPhotos = (): PhotoItem[] => {
  const saved = localStorage.getItem(localStorageKey);
  return saved ? JSON.parse(saved) : [];
};

const saveLocalPhotos = (photos: PhotoItem[]) => {
  localStorage.setItem(localStorageKey, JSON.stringify(photos));
};

// Photo management
export const getPhotos = async (): Promise<PhotoItem[]> => {
  try {
    // If offline, return local storage data first
    if (isOffline()) {
      const localPhotos = getLocalPhotos();
      if (localPhotos.length > 0) {
        return localPhotos;
      }
      // Fall back to demo data
      return getDemoData('photos') as PhotoItem[];
    }
    
    const querySnapshot = await getDocs(collection(db, "photos"));
    const photos: PhotoItem[] = [];
    
    querySnapshot.forEach((doc) => {
      const photoData = doc.data() as PhotoItem;
      photoData.id = doc.id;
      photos.push(photoData);
    });
    
    // Save to local storage for offline use
    saveLocalPhotos(photos);
    
    // Sort by order if available
    return photos.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return 0;
    });
  } catch (error) {
    console.error("Error getting photos:", error);
    
    // Fall back to local storage if Firebase fails
    const localPhotos = getLocalPhotos();
    if (localPhotos.length > 0) {
      return localPhotos;
    }
    
    // Fall back to demo data
    return getDemoData('photos') as PhotoItem[];
  }
};

export const uploadPhoto = async (file: File, alt: string): Promise<PhotoItem> => {
  try {
    const id = uuidv4();
    
    // Create object URL for immediate preview
    const objectUrl = URL.createObjectURL(file);
    
    // If offline, store in local storage only
    if (isOffline()) {
      const localPhotos = getLocalPhotos();
      const order = localPhotos.length > 0 ? 
        Math.max(...localPhotos.map(p => p.order !== undefined ? p.order : 0)) + 1 : 0;
      
      const photoData: PhotoItem = {
        id,
        src: objectUrl, // Use object URL as temporary source
        alt,
        order
      };
      
      // Add to local offline storage
      saveLocalPhotos([...localPhotos, photoData]);
      
      return photoData;
    }
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, `gallery/${id}`);
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
    
    // Update local storage with the new photo
    const localPhotos = getLocalPhotos();
    saveLocalPhotos([...localPhotos, photoData]);
    
    return photoData;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};

export const deletePhoto = async (photoId: string): Promise<void> => {
  try {
    // Update local storage regardless of online status
    const localPhotos = getLocalPhotos();
    saveLocalPhotos(localPhotos.filter(p => p.id !== photoId));
    
    if (isOffline()) {
      // For offline mode, we just update local storage
      return;
    }
    
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
    // Update local storage regardless of online status
    saveLocalPhotos(photos);
    
    if (isOffline()) {
      // For offline mode, we just update local storage
      return;
    }
    
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
