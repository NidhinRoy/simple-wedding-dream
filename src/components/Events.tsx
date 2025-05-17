
import React from 'react';
import { Calendar } from 'lucide-react';

const Events = () => {
  const events = [
    {
      title: "Engagement Ceremony",
      date: "December 25, 2024",
      time: "10:00 AM - 12:00 PM",
      venue: "St. Mary's Church Hall",
      address: "123 Church Street, Kochi, Kerala",
      description: "Join us as we exchange rings and officially begin our journey to marriage."
    },
    {
      title: "Reception",
      date: "December 25, 2024",
      time: "6:00 PM - 10:00 PM",
      venue: "Grand Hyatt",
      address: "456 Resort Lane, Kochi, Kerala",
      description: "An evening of celebration with dinner, dancing, and making memories together."
    },
    {
      title: "Wedding Ceremony",
      date: "April 15, 2025",
      time: "9:00 AM - 1:00 PM",
      venue: "St. Thomas Cathedral",
      address: "789 Cathedral Road, Kochi, Kerala",
      description: "The auspicious ceremony where we will take our vows and become husband and wife."
    }
  ];

  return (
    <section id="events" className="section-container bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="elegant-heading text-3xl md:text-4xl text-center mb-16">Celebrations</h2>
        
        <div className="space-y-16">
          {events.map((event, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-1 md:grid-cols-3 gap-8 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="md:col-span-1 flex justify-center">
                <div className="w-40 h-40 rounded-full bg-wedding-soft-cream flex items-center justify-center border-4 border-wedding-gold">
                  <Calendar size={64} className="text-wedding-maroon" />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="font-dancing text-3xl text-wedding-maroon mb-3">{event.title}</h3>
                <div className="mb-4">
                  <p className="font-medium text-lg mb-1">{event.date}</p>
                  <p className="text-gray-600">{event.time}</p>
                </div>
                <div className="mb-4">
                  <p className="font-medium">{event.venue}</p>
                  <p className="text-gray-600">{event.address}</p>
                </div>
                <p className="text-gray-700">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
