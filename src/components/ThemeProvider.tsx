
import React, { useState, useEffect, createContext, useContext } from 'react';
import { getTheme } from '@/services/firebase';
import { ThemeColors } from '@/services/firebase/types';

// Default theme settings as a fallback
const defaultTheme: ThemeColors = {
  primary: '#8B0000',    // wedding-maroon
  secondary: '#D4AF37',  // wedding-gold
  accent: '#FDF8F0',     // wedding-soft-cream
  background: '#FFFFFF', // white
  text: '#333333'        // dark gray
};

interface ThemeContextType {
  theme: ThemeColors;
  isThemeLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  isThemeLoading: true
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme);
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        setIsThemeLoading(true);
        const themeData = await getTheme();
        setTheme(themeData);
      } catch (error) {
        console.error("Error loading theme:", error);
        // Fallback to default theme if there's an error
        setTheme(defaultTheme);
      } finally {
        setIsThemeLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Apply theme variables to :root CSS variables
  useEffect(() => {
    if (!isThemeLoading) {
      const root = document.documentElement;
      root.style.setProperty('--wedding-maroon', theme.primary);
      root.style.setProperty('--wedding-gold', theme.secondary);
      root.style.setProperty('--wedding-soft-cream', theme.accent);
      root.style.setProperty('--wedding-background', theme.background);
      root.style.setProperty('--wedding-text', theme.text);
    }
  }, [theme, isThemeLoading]);

  return (
    <ThemeContext.Provider value={{ theme, isThemeLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
