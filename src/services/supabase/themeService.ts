
import { supabase } from "@/integrations/supabase/client";
import { ThemeColors } from "../firebase/types";

// Theme management
export const getTheme = async (): Promise<ThemeColors> => {
  try {
    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      primary: data.primary_color,
      secondary: data.secondary_color,
      accent: data.accent_color,
      background: data.background_color,
      text: data.text_color
    };
  } catch (error) {
    console.error("Error getting theme:", error);
    throw error;
  }
};

export const updateTheme = async (theme: ThemeColors): Promise<void> => {
  try {
    const { error } = await supabase
      .from('themes')
      .update({
        primary_color: theme.primary,
        secondary_color: theme.secondary,
        accent_color: theme.accent,
        background_color: theme.background,
        text_color: theme.text
      })
      .eq('id', (await supabase.from('themes').select('id').single()).data?.id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating theme:", error);
    throw error;
  }
};
