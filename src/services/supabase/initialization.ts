
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Initial data setup
export const initializeWeddingData = async () => {
  try {
    // Check if theme data exists
    const { data: themeData, error: themeError } = await supabase
      .from('themes')
      .select('*');
    
    if (themeError) throw themeError;
    
    if (themeData.length === 0) {
      // Insert default theme
      const { error: insertThemeError } = await supabase
        .from('themes')
        .insert({
          primary_color: '#8B0000', // wedding-maroon
          secondary_color: '#D4AF37', // wedding-gold
          accent_color: '#FDF8F0', // wedding-soft-cream
          background_color: '#FFFFFF',
          text_color: '#333333'
        });
      
      if (insertThemeError) throw insertThemeError;
    }
    
    // Check if venue data exists
    const { data: venueData, error: venueError } = await supabase
      .from('venues')
      .select('*');
    
    if (venueError) throw venueError;
    
    if (venueData.length === 0) {
      // Insert default venue
      const { error: insertVenueError } = await supabase
        .from('venues')
        .insert({
          name: 'Wedding Venue',
          address: 'Kochi, Kerala',
          maps_url: 'https://maps.app.goo.gl/tQCb8FZ4Cjnag58i6'
        });
      
      if (insertVenueError) throw insertVenueError;
    }
    
    // Check if wedding details exist
    const { data: detailsData, error: detailsError } = await supabase
      .from('wedding_details')
      .select('*');
    
    if (detailsError) throw detailsError;
    
    if (detailsData.length === 0) {
      // Insert default details
      const { error: insertDetailsError } = await supabase
        .from('wedding_details')
        .insert({
          groom_name: 'Aswin',
          bride_name: 'Priya',
          wedding_date: 'December 25, 2024',
          story: 'Our love story began when we met at a coffee shop...'
        });
      
      if (insertDetailsError) throw insertDetailsError;
    }
    
    // Check if timeline events exist
    const { data: timelineData, error: timelineError } = await supabase
      .from('timeline_events')
      .select('*');
    
    if (timelineError) throw timelineError;
    
    if (timelineData.length === 0) {
      // Insert default timeline events
      const defaultEvents = [
        {
          id: uuidv4(),
          title: 'Ceremony',
          time: '10:00 AM',
          description: 'Main wedding ceremony at the venue',
          order: 0
        },
        {
          id: uuidv4(),
          title: 'Reception',
          time: '6:00 PM',
          description: 'Dinner and celebrations',
          order: 1
        }
      ];
      
      for (const event of defaultEvents) {
        const { error: insertEventError } = await supabase
          .from('timeline_events')
          .insert(event);
        
        if (insertEventError) throw insertEventError;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing wedding data:", error);
    throw error;
  }
};
