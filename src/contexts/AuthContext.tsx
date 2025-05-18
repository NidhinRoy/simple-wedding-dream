
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  User 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // For demonstration purposes in this demo app
      if (email === "admin@wedding.com" && password === "password123") {
        // Mock a successful login for demo purposes
        const mockUser = {
          uid: "demo-user-123",
          email: "admin@wedding.com",
          displayName: "Demo Admin",
          emailVerified: true,
        };
        
        // @ts-ignore - This is a simplified mock user for demo purposes
        setCurrentUser(mockUser);
        
        toast({
          title: "Success!",
          description: "You've successfully logged in with demo credentials.",
        });
        
        return;
      }
      
      // Actual Firebase authentication attempt
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Success!",
        description: "You've successfully logged in.",
      });
    } catch (error: any) {
      // Special handling for demo login
      if (email === "admin@wedding.com" && password === "password123") {
        // We should never reach here if the mock login above works
        console.error("Demo login failed to mock properly", error);
      }
      
      let errorMessage = "Login failed";
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection";
      } else if (error.message?.includes("API key not valid")) {
        errorMessage = "API configuration issue. Using demo mode.";
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
      // For demo user, just clear the state
      if (currentUser?.uid === "demo-user-123") {
        setCurrentUser(null);
        toast({
          title: "Logged out",
          description: "You've been successfully logged out from demo mode.",
        });
        return;
      }
      
      // Actual Firebase logout
      await signOut(auth);
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
