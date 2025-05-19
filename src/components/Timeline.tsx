
import React, { useState, useEffect } from 'react';
import { getTimelineEvents } from '@/services/firebase';
import { TimelineEvent } from '@/services/firebase/types';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';

const Timeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const timelineEvents = await getTimelineEvents();
        setEvents(timelineEvents);
      } catch (error) {
        console.error("Error fetching timeline events:", error);
        toast({
          title: "Error",
          description: "Failed to load wedding events",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    
    // Refresh events when page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchEvents();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-wedding-maroon"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No events scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 md:left-1/2 h-full w-0.5 bg-wedding-gold transform -translate-x-1/2"></div>
      
      <div className="space-y-12">
        {events.map((event, index) => (
          <div 
            key={event.id}
            className={`relative flex flex-col md:flex-row ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* Dot on timeline */}
            <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-wedding-maroon rounded-full transform -translate-x-1/2 mt-1.5 md:mt-2 border-2 border-wedding-gold"></div>
            
            {/* Content */}
            <div className="ml-16 md:ml-0 md:w-1/2 md:px-8">
              <div className={`bg-white p-6 rounded-lg shadow-md transform transition-all hover:-translate-y-1 hover:shadow-lg ${
                index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
              }`}>
                <h3 className="text-xl text-wedding-maroon font-playfair mb-2">{event.title}</h3>
                <div className="flex items-center text-wedding-gold mb-3">
                  <Clock size={16} className="mr-2" />
                  <span>{event.time}</span>
                </div>
                {event.description && (
                  <p className="text-gray-600">{event.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
