
import React, { useState, useEffect } from 'react';
import { getPhotos } from '@/services/supabase'; // Updated import path
import { PhotoItem } from '@/services/firebase/types';
import { useToast } from '@/hooks/use-toast';
import { Image } from 'lucide-react';

const Gallery = () => {
  const [images, setImages] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const photos = await getPhotos();
        setImages(photos);
      } catch (error) {
        console.error("Error fetching photos:", error);
        toast({
          title: "Error",
          description: "Failed to load gallery photos",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
    
    // Refresh photos when page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchPhotos();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [toast]);

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, images.length]);

  return (
    <section id="gallery" className="section-container bg-wedding-soft-cream">
      <div className="max-w-6xl mx-auto">
        <h2 className="elegant-heading text-3xl md:text-4xl text-center mb-12">Our Moments</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-wedding-maroon"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 rounded-full bg-white/70 flex items-center justify-center mb-4">
              <Image size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600">No photos have been added to the gallery yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div 
                key={image.id} 
                className="aspect-square overflow-hidden cursor-pointer rounded-lg shadow-md"
                onClick={() => openLightbox(index)}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-full object-cover transition duration-300 hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-4 right-4 text-white text-3xl hover:text-wedding-gold" 
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Close"
          >
            &times;
          </button>
          
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-wedding-gold" 
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="Previous"
          >
            &#8249;
          </button>
          
          <div 
            className="max-h-[80vh] max-w-[80vw] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {images.length > 0 && (
              <>
                <img 
                  src={images[currentImage].src} 
                  alt={images[currentImage].alt}
                  className="max-h-[80vh] max-w-[80vw] object-contain"
                />
                <p className="text-white text-center mt-2">{images[currentImage].alt}</p>
              </>
            )}
          </div>
          
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-wedding-gold" 
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Next"
          >
            &#8250;
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;
