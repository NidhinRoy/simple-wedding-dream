
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

const RSVP = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attending: 'yes',
    guests: '0',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would send this data to a server
    console.log('Form submitted:', formData);
    
    toast({
      title: "RSVP Submitted",
      description: "Thank you for your response! We look forward to celebrating with you.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      attending: 'yes',
      guests: '0',
      message: '',
    });
  };

  return (
    <section id="rsvp" className="section-container bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="elegant-heading text-3xl md:text-4xl text-center mb-6">RSVP</h2>
        <p className="text-center text-gray-700 mb-12 max-w-xl mx-auto">
          We would be honored to have you join us on our special day. Please let us know if you'll be able to attend by December 1, 2024.
        </p>
        
        <div className="bg-wedding-soft-cream p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-wedding-maroon font-medium mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-gold"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-wedding-maroon font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-gold"
                  placeholder="Your email"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-wedding-maroon font-medium mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-gold"
                  placeholder="Your phone number"
                />
              </div>
              
              <div>
                <label htmlFor="attending" className="block text-wedding-maroon font-medium mb-2">
                  Will you attend?
                </label>
                <select
                  id="attending"
                  name="attending"
                  value={formData.attending}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-gold"
                >
                  <option value="yes">Joyfully Accept</option>
                  <option value="no">Regretfully Decline</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="guests" className="block text-wedding-maroon font-medium mb-2">
                  Number of Guests
                </label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-gold"
                >
                  <option value="0">Just myself</option>
                  <option value="1">Myself + 1 guest</option>
                  <option value="2">Myself + 2 guests</option>
                  <option value="3">Myself + 3 guests</option>
                  <option value="4">Myself + 4 guests</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="message" className="block text-wedding-maroon font-medium mb-2">
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-gold"
                  placeholder="Any dietary restrictions or special messages for us"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-wedding-maroon text-white rounded-md hover:bg-wedding-deep-red transition-colors font-medium uppercase tracking-wider"
              >
                Send RSVP
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RSVP;
