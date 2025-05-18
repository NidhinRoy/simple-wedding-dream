
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getTheme, updateTheme, ThemeColors } from '@/services/firebase';
import { CircleDot } from 'lucide-react';

const ThemeEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState<ThemeColors>({
    primary: '#8B0000',
    secondary: '#D4AF37',
    accent: '#FDF8F0',
    background: '#FFFFFF',
    text: '#333333'
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        setLoading(true);
        const themeData = await getTheme();
        setTheme(themeData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load theme settings: " + error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, [toast]);

  const handleChange = (name: keyof ThemeColors, value: string) => {
    setTheme({
      ...theme,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateTheme(theme);
      
      toast({
        title: "Success",
        description: "Theme colors updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update theme: " + error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-maroon"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-6">Customize Theme Colors</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="primary-color">
              Primary Color (Headings, Buttons)
            </Label>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full border" 
                style={{ backgroundColor: theme.primary }}
              />
              <Input
                id="primary-color"
                type="color"
                value={theme.primary}
                onChange={(e) => handleChange('primary', e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={theme.primary}
                onChange={(e) => handleChange('primary', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary-color">
              Secondary Color (Accents, Icons)
            </Label>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full border" 
                style={{ backgroundColor: theme.secondary }}
              />
              <Input
                id="secondary-color"
                type="color"
                value={theme.secondary}
                onChange={(e) => handleChange('secondary', e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={theme.secondary}
                onChange={(e) => handleChange('secondary', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accent-color">
              Accent Color (Background Highlight)
            </Label>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full border" 
                style={{ backgroundColor: theme.accent }}
              />
              <Input
                id="accent-color"
                type="color"
                value={theme.accent}
                onChange={(e) => handleChange('accent', e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={theme.accent}
                onChange={(e) => handleChange('accent', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="background-color">
              Background Color (Main Areas)
            </Label>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full border" 
                style={{ backgroundColor: theme.background }}
              />
              <Input
                id="background-color"
                type="color"
                value={theme.background}
                onChange={(e) => handleChange('background', e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={theme.background}
                onChange={(e) => handleChange('background', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="text-color">
              Text Color (Main Text)
            </Label>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full border" 
                style={{ backgroundColor: theme.text }}
              />
              <Input
                id="text-color"
                type="color"
                value={theme.text}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={theme.text}
                onChange={(e) => handleChange('text', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium mb-3">Preview</h4>
          <div 
            className="p-4 rounded-md border"
            style={{ backgroundColor: theme.background, color: theme.text }}
          >
            <h5 
              className="text-lg mb-2" 
              style={{ color: theme.primary }}
            >
              Sample Heading
            </h5>
            <p className="mb-3">This is how your text will look with the selected colors.</p>
            <div 
              className="inline-block px-3 py-1 rounded"
              style={{ backgroundColor: theme.primary, color: '#ffffff' }}
            >
              Primary Button
            </div>
            <div 
              className="inline-block px-3 py-1 rounded ml-2"
              style={{ backgroundColor: theme.secondary, color: '#ffffff' }}
            >
              Secondary Button
            </div>
            <div 
              className="mt-3 p-2 rounded"
              style={{ backgroundColor: theme.accent }}
            >
              <p style={{ color: theme.text }}>Accented background section</p>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          style={{ backgroundColor: theme.primary, color: '#ffffff' }}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Theme Colors'}
        </Button>
      </form>
    </div>
  );
};

export default ThemeEditor;
