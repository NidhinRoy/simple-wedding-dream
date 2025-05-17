
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import OurStory from '@/components/OurStory';
import Events from '@/components/Events';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import Location from '@/components/Location';

const Index = () => {
  return (
    <div className="font-montserrat">
      <Navbar />
      <Hero />
      <OurStory />
      <Events />
      <Gallery />
      <Location />
      <Footer />
    </div>
  );
};

export default Index;
