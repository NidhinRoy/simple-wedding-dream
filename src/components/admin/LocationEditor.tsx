import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getVenueInfo, updateVenueInfo, VenueInfo } from '@/services/supabase';
import { MapPin, Link as LinkIcon } from 'lucide-react';

const LocationEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [venue, setVenue] = useState<VenueInfo>({
    name: '',
    address: '',
    mapsUrl: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchVenueInfo = async () => {
      try {
        setLoading(true);
        const venueData = await getVenueInfo();
        setVenue(venueData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load venue information: " + error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVenueInfo();
  }, [toast]);

  const handleChange = (name: keyof VenueInfo, value: string) => {
    setVenue({
      ...venue,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateVenueInfo(venue);
      
      toast({
        title: "Success",
        description: "Venue information updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update venue information: " + error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const validateForm = () => {
    return venue.name.trim() !== '' && 
           venue.address.trim() !== '' && 
           venue.mapsUrl.trim() !== '';
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
      <h3 className="text-lg font-semibold mb-6">Edit Venue Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="venue-name">Venue Name</Label>
          <Input
            id="venue-name"
            value={venue.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Grand Ballroom"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue-address">Venue Address</Label>
          <Input
            id="venue-address"
            value={venue.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="e.g., 123 Wedding Avenue, Kochi, Kerala"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue-map">Google Maps Link</Label>
          <div className="flex gap-2">
            <Input
              id="venue-map"
              value={venue.mapsUrl}
              onChange={(e) => handleChange('mapsUrl', e.target.value)}
              placeholder="e.g., https://maps.app.goo.gl/..."
            />
            {venue.mapsUrl && (
              <Button
                type="button"
                variant="outline"
                onClick={() => window.open(venue.mapsUrl, '_blank')}
                className="flex-shrink-0"
              >
                <LinkIcon size={18} />
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            To get a Google Maps link, search for the location in Google Maps, click "Share", then copy the link.
          </p>
        </div>

        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <MapPin size={18} />
            Preview
          </h4>
          <div className="space-y-2">
            <p className="font-medium">{venue.name || 'Venue Name'}</p>
            <p className="text-gray-700">{venue.address || 'Venue Address'}</p>
            <Button 
              type="button" 
              variant="secondary" 
              className="w-full mt-2" 
              onClick={() => venue.mapsUrl && window.open(venue.mapsUrl, '_blank')}
              disabled={!venue.mapsUrl}
            >
              <MapPin size={16} className="mr-2" />
              Get Directions
            </Button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-wedding-maroon hover:bg-wedding-deep-red"
          disabled={saving || !validateForm()}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
};

export default LocationEditor;
