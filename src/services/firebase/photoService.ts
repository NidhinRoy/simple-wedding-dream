
import { collection, doc, getDoc, setDoc, updateDoc, getDocs, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { v4 as uuidv4 } from 'uuid';
import { PhotoItem } from "./types";

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
