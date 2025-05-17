
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { submitRSVP } from '@/services/firebaseService';

const RSVPForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: true,
    plusOne: false,
    dietaryRestrictions: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please provide your name and email",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSubmitting(true);
      await submitRSVP(formData);
      
      setSubmitted(true);
      toast({
        title: "RSVP Submitted",
        description: "Thank you for your response!",
      });
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setFormData({
      name: '',
      email: '',
      attending: true,
      plusOne: false,
      dietaryRestrictions: '',
      message: ''
    });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-medium text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600 mb-6">Your RSVP has been successfully submitted.</p>
        <Button onClick={reset}>Submit Another Response</Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
          disabled={submitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          required
          disabled={submitting}
        />
      </div>
      
      <div className="border-t border-b py-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="attending"
            checked={formData.attending}
            onCheckedChange={(checked) => 
              handleCheckboxChange('attending', checked === true)
            }
            disabled={submitting}
          />
          <Label 
            htmlFor="attending" 
            className="font-medium text-base cursor-pointer"
          >
            I will attend the wedding
          </Label>
        </div>
        
        {formData.attending && (
          <div className="space-y-4 pl-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="plusOne" 
                checked={formData.plusOne}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('plusOne', checked === true)
                }
                disabled={submitting}
              />
              <Label 
                htmlFor="plusOne"
                className="cursor-pointer"
              >
                I'll bring a plus one
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
              <Input
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleChange}
                placeholder="Any dietary restrictions or allergies?"
                disabled={submitting}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message for the Couple (Optional)</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Share your thoughts or wishes..."
          rows={4}
          disabled={submitting}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-wedding-maroon hover:bg-wedding-deep-red"
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : 'Submit RSVP'}
      </Button>
    </form>
  );
};

export default RSVPForm;
