
import React from 'react';

const OurStory = () => {
  return (
    <section id="story" className="section-container bg-wedding-soft-cream bg-floral">
      <div className="max-w-4xl mx-auto">
        <h2 className="elegant-heading text-3xl md:text-4xl text-center mb-12">Our Love Story</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img 
              src="/lovable-uploads/b6e45c66-58d4-4694-96aa-c657e7fbaa63.png" 
              alt="Aswin and Priya together" 
              className="w-full h-auto object-cover image-transition"
            />
          </div>
          
          <div>
            <h3 className="font-dancing text-3xl md:text-4xl text-wedding-maroon mb-4">How We Met</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Our story began on a rainy evening in Kerala, where fate brought us together at a mutual friend's birthday celebration. What started as casual conversation quickly blossomed into a deep connection that neither of us expected.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Through countless coffee dates, long phone calls, and adventures exploring our favorite places, we discovered that we were truly made for each other. Each moment together confirmed what we already knew in our hearts - that this was the beginning of forever.
            </p>
          </div>
          
          <div className="md:order-last">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <img 
                src="/lovable-uploads/11b702fc-8586-4a29-9675-a1aedd542305.png" 
                alt="Aswin and Priya in traditional attire" 
                className="w-full h-auto object-cover image-transition"
              />
            </div>
          </div>
          
          <div>
            <h3 className="font-dancing text-3xl md:text-4xl text-wedding-maroon mb-4">The Proposal</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              After three beautiful years together, Aswin knew it was time. During a weekend trip to our favorite coastal spot, he surprised Priya with a carefully planned proposal at sunset, surrounded by the beauty of the ocean and sky.
            </p>
            <p className="text-gray-700 leading-relaxed">
              With tears of joy and hearts full of love, we began planning the next chapter of our lives together. We can't wait to celebrate this special journey with all of our loved ones on our wedding day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
