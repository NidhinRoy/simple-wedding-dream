
import { supabase } from "@/integrations/supabase/client";
import { ThemeColors, WeddingDetails, VenueInfo } from "../firebase/types";

// Initialize default data if it doesn't exist
export const initializeWeddingData = async (): Promise<boolean> => {
  try {
    console.log("Initializing wedding data...");
    
    // Check if we need to create the wedding-photos storage bucket
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        throw bucketsError;
      }
      
      const weddingPhotosBucket = buckets?.find(bucket => bucket.name === 'wedding-photos');
      
      if (!weddingPhotosBucket) {
        console.log("Creating wedding-photos storage bucket");
        const { error: createBucketError } = await supabase.storage.createBucket('wedding-photos', {
          public: true
        });
        
        if (createBucketError) {
          console.error("Error creating bucket:", createBucketError);
        }
      }
    } catch (error) {
      console.error("Error checking/creating storage bucket:", error);
    }
    
    // Check if theme exists
    let created = false;
    const { data: existingTheme, error: themeError } = await supabase
      .from('themes')
      .select('id')
      .limit(1);
      
    if (themeError) {
      throw themeError;
    }
    
    if (!existingTheme || existingTheme.length === 0) {
      created = true;
      console.log("Creating default theme");
      
      // Create default theme
      const defaultTheme: ThemeColors = {
        primary: '#8B0000',
        secondary: '#D4AF37',
        accent: '#FDF8F0',
        background: '#FFFFFF',
        text: '#333333'
      };
      
      const { error: insertThemeError } = await supabase
        .from('themes')
        .insert([{
          primary_color: defaultTheme.primary,
          secondary_color: defaultTheme.secondary,
          accent_color: defaultTheme.accent,
          background_color: defaultTheme.background,
          text_color: defaultTheme.text
        }]);
        
      if (insertThemeError) {
        throw insertThemeError;
      }
    }
    
    // Check if venue exists
    const { data: existingVenue, error: venueError } = await supabase
      .from('venues')
      .select('id')
      .limit(1);
      
    if (venueError) {
      throw venueError;
    }
    
    if (!existingVenue || existingVenue.length === 0) {
      created = true;
      console.log("Creating default venue");
      
      // Create default venue
      const defaultVenue: VenueInfo = {
        name: 'Wedding Venue',
        address: 'Kochi, Kerala',
        mapsUrl: 'https://maps.app.goo.gl/tQCb8FZ4Cjnag58i6'
      };
      
      const { error: insertVenueError } = await supabase
        .from('venues')
        .insert([{
          name: defaultVenue.name,
          address: defaultVenue.address,
          maps_url: defaultVenue.mapsUrl
        }]);
        
      if (insertVenueError) {
        throw insertVenueError;
      }
    }
    
    // Check if wedding details exist
    const { data: existingDetails, error: detailsError } = await supabase
      .from('wedding_details')
      .select('id')
      .limit(1);
      
    if (detailsError) {
      throw detailsError;
    }
    
    if (!existingDetails || existingDetails.length === 0) {
      created = true;
      console.log("Creating default wedding details");
      
      // Create default wedding details
      const defaultDetails: WeddingDetails = {
        groomName: 'Aswin',
        brideName: 'Priya',
        weddingDate: 'December 25, 2024',
        story: 'Our love story began when we met at a coffee shop...'
      };
      
      const { error: insertDetailsError } = await supabase
        .from('wedding_details')
        .insert([{
          groom_name: defaultDetails.groomName,
          bride_name: defaultDetails.brideName,
          wedding_date: defaultDetails.weddingDate,
          story: defaultDetails.story
        }]);
        
      if (insertDetailsError) {
        throw insertDetailsError;
      }
    }
    
    return created;
  } catch (error) {
    console.error("Error initializing wedding data:", error);
    throw error;
  }
};
