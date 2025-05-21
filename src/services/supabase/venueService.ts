
import { supabase } from "@/integrations/supabase/client";
import { VenueInfo } from "../firebase/types";

// Venue/Location management
export const getVenueInfo = async (): Promise<VenueInfo> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      name: data.name,
      address: data.address,
      mapsUrl: data.maps_url
    };
  } catch (error) {
    console.error("Error getting venue info:", error);
    throw error;
  }
};

export const updateVenueInfo = async (venue: VenueInfo): Promise<void> => {
  try {
    const { error } = await supabase
      .from('venues')
      .update({
        name: venue.name,
        address: venue.address,
        maps_url: venue.mapsUrl
      })
      .eq('id', (await supabase.from('venues').select('id').single()).data?.id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating venue info:", error);
    throw error;
  }
};
