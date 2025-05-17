
import React, { useState, useEffect } from 'react';
import { getPhotos, PhotoItem } from '@/services/firebaseService';
import { useToast } from '@/hooks/use-toast';

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

  return (
    <section id="gallery" className="section-container bg-wedding-soft-cream">
      <div className="max-w-6xl mx-auto">
        <h2 className="elegant-heading text-3xl md:text-4xl text-center mb-12">Our Moments</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-wedding-maroon"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-8">
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
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button 
            className="absolute top-4 right-4 text-white text-3xl hover:text-wedding-gold" 
            onClick={closeLightbox}
          >
            &times;
          </button>
          
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-wedding-gold" 
            onClick={prevImage}
          >
            &#8249;
          </button>
          
          <div className="max-h-[80vh] max-w-[80vw] relative">
            {images.length > 0 && (
              <img 
                src={images[currentImage].src} 
                alt={images[currentImage].alt}
                className="max-h-[80vh] max-w-[80vw] object-contain"
              />
            )}
          </div>
          
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-wedding-gold" 
            onClick={nextImage}
          >
            &#8250;
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;
