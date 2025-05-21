
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { GuestRSVP } from "../firebase/types";

// RSVP Management
export const getRSVPs = async (): Promise<GuestRSVP[]> => {
  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return data.map(rsvp => ({
      id: rsvp.id,
      name: rsvp.name,
      email: rsvp.email,
      attending: rsvp.attending,
      plusOne: rsvp.plus_one,
      dietaryRestrictions: rsvp.dietary_restrictions || '',
      message: rsvp.message || '',
      timestamp: rsvp.timestamp
    }));
  } catch (error) {
    console.error("Error getting RSVPs:", error);
    throw error;
  }
};

export const submitRSVP = async (rsvp: Omit<GuestRSVP, 'id' | 'timestamp'>): Promise<GuestRSVP> => {
  try {
    const timestamp = Date.now();
    const rsvpData = {
      id: uuidv4(),
      name: rsvp.name,
      email: rsvp.email,
      attending: rsvp.attending,
      plus_one: rsvp.plusOne,
      dietary_restrictions: rsvp.dietaryRestrictions,
      message: rsvp.message,
      timestamp
    };
    
    const { error } = await supabase
      .from('rsvps')
      .insert(rsvpData);
    
    if (error) throw error;
    
    return {
      id: rsvpData.id,
      name: rsvpData.name,
      email: rsvpData.email,
      attending: rsvpData.attending,
      plusOne: rsvpData.plus_one,
      dietaryRestrictions: rsvpData.dietary_restrictions || '',
      message: rsvpData.message || '',
      timestamp
    };
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    throw error;
  }
};

export const deleteRSVP = async (rsvpId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .eq('id', rsvpId);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting RSVP:", error);
    throw error;
  }
};
