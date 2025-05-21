
import { supabase } from "@/integrations/supabase/client";
import { WeddingDetails } from "../firebase/types";

// Wedding details management
export const getWeddingDetails = async (): Promise<WeddingDetails> => {
  try {
    const { data, error } = await supabase
      .from('wedding_details')
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      groomName: data.groom_name,
      brideName: data.bride_name,
      weddingDate: data.wedding_date,
      story: data.story
    };
  } catch (error) {
    console.error("Error getting wedding details:", error);
    throw error;
  }
};

export const updateWeddingDetails = async (details: WeddingDetails): Promise<void> => {
  try {
    const { error } = await supabase
      .from('wedding_details')
      .update({
        groom_name: details.groomName,
        bride_name: details.brideName,
        wedding_date: details.weddingDate,
        story: details.story
      })
      .eq('id', (await supabase.from('wedding_details').select('id').single()).data?.id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating wedding details:", error);
    throw error;
  }
};
