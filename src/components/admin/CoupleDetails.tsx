
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getWeddingDetails, updateWeddingDetails, WeddingDetails } from '@/services/firebaseService';
import { Calendar, User, Heart } from 'lucide-react';

const CoupleDetails = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [details, setDetails] = useState<WeddingDetails>({
    groomName: '',
    brideName: '',
    weddingDate: '',
    story: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const detailsData = await getWeddingDetails();
        setDetails(detailsData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load couple details: " + error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [toast]);

  const handleChange = (name: keyof WeddingDetails, value: string) => {
    setDetails({
      ...details,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateWeddingDetails(details);
      
      toast({
        title: "Success",
        description: "Couple details updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update couple details: " + error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const validateForm = () => {
    return details.groomName.trim() !== '' && 
           details.brideName.trim() !== '' && 
           details.weddingDate.trim() !== '';
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
      <h3 className="text-lg font-semibold mb-6">Edit Couple Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="groom-name">Groom's Name</Label>
            <Input
              id="groom-name"
              value={details.groomName}
              onChange={(e) => handleChange('groomName', e.target.value)}
              placeholder="e.g., Aswin"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bride-name">Bride's Name</Label>
            <Input
              id="bride-name"
              value={details.brideName}
              onChange={(e) => handleChange('brideName', e.target.value)}
              placeholder="e.g., Priya"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="wedding-date">Wedding Date</Label>
          <Input
            id="wedding-date"
            value={details.weddingDate}
            onChange={(e) => handleChange('weddingDate', e.target.value)}
            placeholder="e.g., December 25, 2024"
          />
          <p className="text-xs text-gray-500 mt-1">
            Format as you would like it displayed (e.g., "December 25, 2024" or "25.12.2024")
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="couple-story">Your Love Story</Label>
          <Textarea
            id="couple-story"
            value={details.story}
            onChange={(e) => handleChange('story', e.target.value)}
            placeholder="Tell your love story..."
            rows={6}
            className="resize-none"
          />
        </div>

        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Heart size={18} className="text-wedding-maroon" />
            Preview
          </h4>
          <div className="space-y-2">
            <h5 className="text-center text-xl font-dancing">
              {details.groomName || 'Groom'} & {details.brideName || 'Bride'}
            </h5>
            <p className="text-center flex items-center justify-center gap-2 text-sm">
              <Calendar size={16} />
              {details.weddingDate || 'Wedding Date'}
            </p>
            {details.story && (
              <p className="mt-2 text-sm italic">
                "{details.story.length > 100 
                  ? details.story.substring(0, 100) + '...' 
                  : details.story}"
              </p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-wedding-maroon hover:bg-wedding-deep-red"
          disabled={saving || !validateForm()}
        >
          {saving ? 'Saving...' : 'Save Couple Details'}
        </Button>
      </form>
    </div>
  );
};

export default CoupleDetails;
