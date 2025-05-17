
import React from 'react';
import { Link as ScrollLink } from 'react-scroll';

const Hero = () => {
  return (
    <section id="home" className="h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: "url('/lovable-uploads/ed2a6010-65ce-4af8-8661-e611da5c82f1.png')" }}
      />
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
        <div className="text-center">
          <h1 className="font-playfair text-3xl md:text-5xl lg:text-6xl mb-4 animate-fade-in">
            ASWIN & PRIYA
          </h1>
          <div className="w-32 h-0.5 bg-wedding-gold mx-auto mb-6 animate-fade-in-delayed"></div>
          <p className="font-dancing text-4xl md:text-5xl lg:text-6xl mb-6 animate-fade-in">
            We are getting engaged
          </p>
          <p className="font-montserrat uppercase tracking-widest text-xl md:text-2xl lg:text-3xl mb-2 animate-fade-in-delayed">
            SAVE OUR DATE
          </p>
          <p className="font-montserrat text-xl md:text-2xl lg:text-3xl mb-8 animate-fade-in-delayed">
            25.12.2024
          </p>
          
          <ScrollLink
            to="rsvp"
            spy={true}
            smooth={true}
            offset={-70}
            duration={800}
            className="inline-block mt-8 px-8 py-3 border-2 border-white hover:bg-white hover:text-wedding-maroon transition-colors duration-300 font-medium tracking-wide uppercase text-sm animate-fade-in-delayed"
          >
            RSVP
          </ScrollLink>
        </div>
      </div>
    </section>
  );
};

export default Hero;
