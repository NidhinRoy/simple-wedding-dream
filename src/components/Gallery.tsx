
import React, { useState } from 'react';

const Gallery = () => {
  const images = [
    {
      src: "/lovable-uploads/b6e45c66-58d4-4694-96aa-c657e7fbaa63.png",
      alt: "Close up portrait of couple",
    },
    {
      src: "/lovable-uploads/ed2a6010-65ce-4af8-8661-e611da5c82f1.png",
      alt: "Couple in traditional attire near a building",
    },
    {
      src: "/lovable-uploads/b3d92506-d627-4cbe-85a2-4162089d3dff.png",
      alt: "Couple at formal event",
    },
    {
      src: "/lovable-uploads/a7e97d44-2d65-4a6d-817e-382f9c5fd284.png",
      alt: "Intimate couple portrait",
    },
    {
      src: "/lovable-uploads/bc073771-431b-48b8-ba52-920998e63bad.png",
      alt: "Couple at the beach",
    },
    {
      src: "/lovable-uploads/aa80edb3-29cc-479d-8302-d08b6460e990.png",
      alt: "Couple posing outdoors",
    },
    {
      src: "/lovable-uploads/b6dce6db-659f-4c64-8b66-9e25a1392636.png",
      alt: "Couple in elegant attire",
    },
    {
      src: "/lovable-uploads/f3e0868b-eed1-4846-ad71-ec92cb64160d.png",
      alt: "Couple dancing at the beach",
    },
    {
      src: "/lovable-uploads/a63255d5-5d0d-4b63-bf6e-67d3db27e43d.png", 
      alt: "Couple with vintage items at the beach",
    },
    {
      src: "/lovable-uploads/11b702fc-8586-4a29-9675-a1aedd542305.png",
      alt: "Couple in traditional attire at historic location",
    },
    {
      src: "/lovable-uploads/f4ce0d7a-c8fd-4bd1-bdd2-e48dcb2f0500.png",
      alt: "Couple in garden setting",
    }
  ];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div 
              key={index} 
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
            <img 
              src={images[currentImage].src} 
              alt={images[currentImage].alt}
              className="max-h-[80vh] max-w-[80vw] object-contain"
            />
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
