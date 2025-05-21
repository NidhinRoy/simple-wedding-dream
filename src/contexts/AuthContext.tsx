
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // For demonstration purposes in this demo app
      if (email === "admin@wedding.com" && password === "password123") {
        // Since we can't mock a Supabase user easily, let's attempt to sign in
        // but with a special notification
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          // If the demo user doesn't exist in Supabase yet, create it
          // In a real app, you would never do this, but for demo purposes, it's acceptable
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password
          });

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
      let errorMessage = "Login failed";
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password";
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error. Please check your connection";
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
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
