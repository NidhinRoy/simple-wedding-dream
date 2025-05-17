
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, MapPin, Image, CalendarClock, User, LogIn, LogOut, MailCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PhotoManager from '@/components/admin/PhotoManager';
import ThemeEditor from '@/components/admin/ThemeEditor';
import LocationEditor from '@/components/admin/LocationEditor';
import CoupleDetails from '@/components/admin/CoupleDetails';
import TimelineEditor from '@/components/admin/TimelineEditor';
import RSVPManager from '@/components/admin/RSVPManager';
import { initializeWeddingData } from '@/services/firebaseService';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { currentUser, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Initialize default data in Firebase if it doesn't exist
    if (currentUser) {
      const setupData = async () => {
        try {
          const created = await initializeWeddingData();
          if (created) {
            toast({
              title: "Setup Complete",
              description: "Default wedding data has been initialized.",
            });
          }
        } catch (error) {
          console.error("Error initializing data:", error);
        }
      };
      
      setupData();
    }
  }, [currentUser, toast]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Login Error",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoggingIn(true);
    try {
      await login(email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      // Error handling is done in the login function
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="font-dancing text-3xl text-wedding-maroon">Wedding Admin</h1>
            <p className="mt-2 text-gray-600">Sign in to manage your wedding website</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  disabled={isLoggingIn}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="current-password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  disabled={isLoggingIn}
                />
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full flex justify-center py-2 px-4 bg-wedding-maroon hover:bg-wedding-deep-red"
                disabled={isLoggingIn}
              >
                <LogIn className="mr-2 h-4 w-4" />
                {isLoggingIn ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Default login: admin@wedding.com / password123
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="font-dancing text-2xl text-wedding-maroon">Wedding Site Editor</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden md:inline-block">
              Signed in as {currentUser.email}
            </span>
            <Button 
              variant="outline" 
              onClick={() => logout()}
              size="sm"
            >
              <LogOut size={16} className="mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="photos">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Photos</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              <span>Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="rsvp" className="flex items-center gap-2">
              <MailCheck className="h-4 w-4" />
              <span>RSVPs</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Theme</span>
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Details</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="photos">
            <PhotoManager />
          </TabsContent>
          
          <TabsContent value="timeline">
            <TimelineEditor />
          </TabsContent>
          
          <TabsContent value="rsvp">
            <RSVPManager />
          </TabsContent>
          
          <TabsContent value="theme">
            <ThemeEditor />
          </TabsContent>
          
          <TabsContent value="location">
            <LocationEditor />
          </TabsContent>
          
          <TabsContent value="details">
            <CoupleDetails />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
