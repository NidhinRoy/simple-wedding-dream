
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { PhotoItem } from "../firebase/types";

// Store uploads locally when offline
const localStorageKey = "wedding_photos_offline";

const getLocalPhotos = (): PhotoItem[] => {
  const saved = localStorage.getItem(localStorageKey);
  return saved ? JSON.parse(saved) : [];
};

const saveLocalPhotos = (photos: PhotoItem[]) => {
  localStorage.setItem(localStorageKey, JSON.stringify(photos));
};

// Check if offline
const isOffline = () => !navigator.onLine;

// Photo management
export const getPhotos = async (): Promise<PhotoItem[]> => {
  try {
    // If offline, return local storage data first
    if (isOffline()) {
      const localPhotos = getLocalPhotos();
      if (localPhotos.length > 0) {
        return localPhotos;
      }
    }
    
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('order');
    
    if (error) throw error;
    
    const photos = data.map(photo => ({
      id: photo.id,
      src: photo.src,
      alt: photo.alt,
      order: photo.order
    }));
    
    // Save to local storage for offline use
    saveLocalPhotos(photos);
    
    return photos;
  } catch (error) {
    console.error("Error getting photos:", error);
    
    // Fall back to local storage if Supabase fails
    const localPhotos = getLocalPhotos();
    if (localPhotos.length > 0) {
      return localPhotos;
    }
    
    throw error;
  }
};

export const uploadPhoto = async (file: File, alt: string): Promise<PhotoItem> => {
  try {
    const id = uuidv4();
    const filePath = `${id}-${file.name.replace(/\s+/g, '-')}`;
    
    // If offline, store in local storage only with object URL
    if (isOffline()) {
      const objectUrl = URL.createObjectURL(file);
      const localPhotos = getLocalPhotos();
      const order = localPhotos.length > 0 ? 
        Math.max(...localPhotos.map(p => p.order !== undefined ? p.order : 0)) + 1 : 0;
      
      const photoData: PhotoItem = {
        id,
        src: objectUrl,
        alt,
        order
      };
      
      saveLocalPhotos([...localPhotos, photoData]);
      return photoData;
    }
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('wedding-photos')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('wedding-photos')
      .getPublicUrl(filePath);
    
    // Get current photos to determine the next order
    const { data: currentPhotos, error: photosError } = await supabase
      .from('photos')
      .select('order');
      
    if (photosError) throw photosError;
    
    const order = currentPhotos.length > 0 ? 
      Math.max(...currentPhotos.map(p => p.order || 0)) + 1 : 0;
    
    // Store metadata in database
    const photoData = {
      id,
      src: publicUrl,
      alt,
      order
    };
    
    const { error: insertError } = await supabase
      .from('photos')
      .insert({
        id: photoData.id,
        src: photoData.src,
        alt: photoData.alt,
        order: photoData.order
      });
    
    if (insertError) throw insertError;
    
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
    const photoToRemove = localPhotos.find(p => p.id === photoId);
    saveLocalPhotos(localPhotos.filter(p => p.id !== photoId));
    
    if (isOffline()) {
      // For offline mode, we just update local storage
      return;
    }
    
    // Get file path from the photo URL
    const { data: photoData } = await supabase
      .from('photos')
      .select('src')
      .eq('id', photoId)
      .single();
    
    if (photoData) {
      // Extract filename from URL - might need adjustment based on actual URL format
      const filePath = photoData.src.split('/').pop();
      
      if (filePath) {
        // Delete from Storage
        await supabase.storage.from('wedding-photos').remove([filePath]);
      }
    }
    
    // Delete from Database
    await supabase
      .from('photos')
      .delete()
      .eq('id', photoId);
    
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
      return supabase
        .from('photos')
        .update({ order: index })
        .eq('id', photo.id);
    });
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error updating photo order:", error);
    throw error;
  }
};
