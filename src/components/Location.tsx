
import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from './ui/button';

const Location = () => {
  const mapsUrl = "https://maps.app.goo.gl/tQCb8FZ4Cjnag58i6";
  
  return (
    <section id="location" className="section-container bg-wedding-cream">
      <div className="max-w-4xl mx-auto">
        <h2 className="elegant-heading text-3xl md:text-4xl text-center mb-6">Venue Location</h2>
        <p className="text-center text-gray-700 mb-8 max-w-xl mx-auto">
          We're excited to welcome you to our special day. Here's where the celebration will take place.
        </p>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="w-full h-72 md:h-96">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.2487518794997!2d76.29640300000001!3d9.979719699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d514abec6bf%3A0xbd582caa5844192!2sKochi%2C%20Kerala%2C%20India!5e0!3m2!1sen!2sus!4v1717902244851!5m2!1sen!2sus"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Wedding Venue Location"
            ></iframe>
          </div>
          
          <div className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="text-wedding-maroon mr-2" />
              <h3 className="font-semibold text-xl">Kochi, Kerala, India</h3>
            </div>
            <p className="mb-6 text-gray-600">Join us for our special day at this beautiful venue in Kochi</p>
            <Button 
              variant="outline" 
              className="border-wedding-maroon text-wedding-maroon hover:bg-wedding-maroon hover:text-white"
              asChild
            >
              <a 
                href={mapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <MapPin size={16} />
                Get Directions
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
