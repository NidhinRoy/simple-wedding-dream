
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import OurStory from '@/components/OurStory';
import Events from '@/components/Events';
import Gallery from '@/components/Gallery';
import RSVP from '@/components/RSVP';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="font-montserrat">
      <Navbar />
      <Hero />
      <OurStory />
      <Events />
      <Gallery />
      <RSVP />
      <Footer />
    </div>
  );
};

export default Index;
