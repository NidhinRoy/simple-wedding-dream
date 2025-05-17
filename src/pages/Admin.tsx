
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Palette, MapPin, Image, Move, User, LogIn } from 'lucide-react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally validate against a backend
    if (email && password) {
      setIsLoggedIn(true);
    }
  };
  
  if (!isLoggedIn) {
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
                />
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full flex justify-center py-2 px-4 bg-wedding-maroon hover:bg-wedding-deep-red"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </Button>
            </div>
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
          <Button 
            variant="outline" 
            onClick={() => setIsLoggedIn(false)}
          >
            Log Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Photo Gallery Management */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Image className="text-wedding-maroon mr-2" />
              <h2 className="text-xl font-semibold">Manage Photos</h2>
            </div>
            <p className="text-gray-600 mb-4">Add, remove, or reorder photos in your gallery</p>
            <Button className="w-full bg-wedding-maroon hover:bg-wedding-deep-red">
              Edit Gallery
            </Button>
          </div>

          {/* Theme Colors */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Palette className="text-wedding-maroon mr-2" />
              <h2 className="text-xl font-semibold">Change Theme</h2>
            </div>
            <p className="text-gray-600 mb-4">Customize colors and styling of your wedding site</p>
            <Button className="w-full bg-wedding-maroon hover:bg-wedding-deep-red">
              Edit Theme
            </Button>
          </div>

          {/* Location Management */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <MapPin className="text-wedding-maroon mr-2" />
              <h2 className="text-xl font-semibold">Update Location</h2>
            </div>
            <p className="text-gray-600 mb-4">Change the venue address and Google Maps link</p>
            <Button className="w-full bg-wedding-maroon hover:bg-wedding-deep-red">
              Edit Location
            </Button>
          </div>

          {/* Layout Management */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Move className="text-wedding-maroon mr-2" />
              <h2 className="text-xl font-semibold">Arrange Layout</h2>
            </div>
            <p className="text-gray-600 mb-4">Drag and drop sections to reorder them on your site</p>
            <Button className="w-full bg-wedding-maroon hover:bg-wedding-deep-red">
              Edit Layout
            </Button>
          </div>

          {/* Couple Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <User className="text-wedding-maroon mr-2" />
              <h2 className="text-xl font-semibold">Edit Details</h2>
            </div>
            <p className="text-gray-600 mb-4">Update your names, date, and story information</p>
            <Button className="w-full bg-wedding-maroon hover:bg-wedding-deep-red">
              Edit Details
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
