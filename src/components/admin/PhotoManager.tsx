import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Upload, MoveVertical, Image } from 'lucide-react';
import { PhotoItem, getPhotos, uploadPhoto, deletePhoto, updatePhotoOrder } from '@/services/supabase';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const PhotoManager = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState(!navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    fetchPhotos();
    
    const handleOnlineStatusChange = () => {
      setOfflineMode(!navigator.onLine);
      // Refetch photos when going online
      if (navigator.onLine) {
        fetchPhotos();
      }
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const fetchedPhotos = await getPhotos();
      setPhotos(fetchedPhotos);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load photos: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      
      // Auto-fill alt text with filename if empty
      if (!altText) {
        const fileName = selectedFile.name.split('.')[0]
          .replace(/-/g, ' ')
          .replace(/_/g, ' ');
        setAltText(fileName);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      const description = altText || "Wedding photo";
      const newPhoto = await uploadPhoto(file, description);
      
      setPhotos([...photos, newPhoto]);
      
      // Reset form
      setFile(null);
      setAltText('');
      setPreviewUrl(null);
      
      toast({
        title: "Success",
        description: offlineMode 
          ? "Photo saved in offline mode. Will sync when online."
          : "Photo uploaded successfully",
      });
      
      // Reset file input
      const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    try {
      await deletePhoto(photoId);
      setPhotos(photos.filter(photo => photo.id !== photoId));
      
      toast({
        title: "Success",
        description: offlineMode 
          ? "Photo removed in offline mode. Will sync when online."
          : "Photo deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const reorderedPhotos = Array.from(photos);
    const [removed] = reorderedPhotos.splice(result.source.index, 1);
    reorderedPhotos.splice(result.destination.index, 0, removed);
    
    // Update state immediately for responsive UI
    setPhotos(reorderedPhotos);
    
    try {
      // Save the new order
      await updatePhotoOrder(reorderedPhotos);
      
      toast({
        title: "Success",
        description: offlineMode 
          ? "Photo order updated in offline mode. Will sync when online."
          : "Photo order updated",
      });
    } catch (error: any) {
      // If error, revert to previous state
      fetchPhotos();
      
      toast({
        title: "Error",
        description: "Failed to update photo order: " + error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      {offlineMode && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-center space-x-3">
          <div className="bg-amber-100 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-700">
              <path d="M14.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
              <path d="M16.5 8.5a4 4 0 0 0-6.5 4.7"></path>
              <path d="M19.5 10a7 7 0 0 0-13 4"></path>
              <line x1="4" x2="20" y1="16" y2="16"></line>
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-amber-800">Offline Mode Active</h3>
            <p className="text-sm text-amber-700">Changes will be saved locally and synced when you're back online.</p>
          </div>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Upload New Photo</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo-upload">Select Image</Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
          
          {previewUrl && (
            <div className="border rounded-md overflow-hidden w-full max-w-xs mx-auto">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-48 object-cover" 
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="alt-text">Description (Alt Text)</Label>
            <Input
              id="alt-text"
              type="text"
              placeholder="Describe this photo"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              disabled={uploading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-wedding-maroon hover:bg-wedding-deep-red"
            disabled={!file || uploading}
          >
            {uploading ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Manage Gallery Photos</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-maroon"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Image size={36} className="text-gray-400" />
            </div>
            <p className="text-center text-gray-500">No photos in the gallery yet</p>
            <p className="text-sm text-gray-400 mt-2">Upload your first photo to get started</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="gallery-photos">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {photos.map((photo, index) => (
                    <Draggable key={photo.id} draggableId={photo.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center bg-gray-50 p-3 rounded-md border border-gray-100"
                        >
                          <div 
                            {...provided.dragHandleProps}
                            className="p-2 cursor-grab text-gray-400 hover:text-wedding-maroon"
                          >
                            <MoveVertical size={20} />
                          </div>
                          <div className="h-16 w-16 mr-4 overflow-hidden rounded-md">
                            <img 
                              src={photo.src} 
                              alt={photo.alt}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm truncate">{photo.alt}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDelete(photo.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default PhotoManager;
