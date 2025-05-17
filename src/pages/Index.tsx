
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import OurStory from '@/components/OurStory';
import Events from '@/components/Events';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import Location from '@/components/Location';
import Timeline from '@/components/Timeline';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import RSVPForm from '@/components/RSVPForm';

const Index = () => {
  return (
    <div className="font-montserrat">
      <Navbar />
      <Hero />
      <OurStory />
      
      {/* Schedule Timeline */}
      <section id="schedule" className="section-container">
        <div className="max-w-6xl mx-auto">
          <h2 className="elegant-heading text-3xl md:text-4xl text-center mb-12">Wedding Schedule</h2>
          <Timeline />
        </div>
      </section>
      
      <Separator className="max-w-6xl mx-auto my-12 bg-wedding-gold/20" />
      
      <Events />
      <Gallery />
      
      {/* RSVP Section */}
      <section id="rsvp" className="section-container bg-wedding-soft-cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="elegant-heading text-3xl md:text-4xl text-center mb-4">RSVP</h2>
          <p className="text-center text-gray-600 max-w-lg mx-auto mb-12">
            Please let us know if you'll be joining us on our special day. 
            We kindly request your response by December 1, 2024.
          </p>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
            <RSVPForm />
          </Card>
        </div>
      </section>
      
      <Location />
      <Footer />
    </div>
  );
};

export default Index;
