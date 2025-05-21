
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Helper function to clean up Supabase auth state in storage
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setCurrentUser(session?.user ?? null);
        
        // Debug logging to help troubleshoot
        console.log("Auth state changed:", event, session?.user?.email);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
      
      // Debug logging
      console.log("Initial session check:", session?.user?.email);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Clean up existing state first
      cleanupAuthState();
      
      // Try global sign out first to ensure clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      console.log("Attempting login with:", email);
      
      // For demonstration purposes in this demo app
      if (email === "admin@wedding.com" && password === "password123") {
        // Since we can't mock a Supabase user easily, let's attempt to sign in
        // but with a special notification
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        console.log("Login response:", data?.user?.email, error?.message);

        if (error) {
          // If the demo user doesn't exist in Supabase yet, create it
          // In a real app, you would never do this, but for demo purposes, it's acceptable
          console.log("Attempting signup for demo user");
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password
          });

          console.log("Signup response:", signUpData?.user?.email, signUpError?.message);

          if (signUpError) {
            throw signUpError;
          }

          toast({
            title: "Demo Mode",
            description: "You've been logged in with demo credentials. In a real app, you would need to sign up first.",
          });

          return;
        }

        toast({
          title: "Success!",
          description: "You've successfully logged in with demo credentials.",
        });
        
        return;
      }
      
      // Actual Supabase authentication
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've successfully logged in.",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Login failed";
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password";
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error. Please check your connection";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please check your email to confirm your account";
      } else {
        errorMessage = error.message || "An unknown error occurred";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out (fallback if it fails)
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      // Force page reload for a clean state
      window.location.href = '/';
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    session,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
