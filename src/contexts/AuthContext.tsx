
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User, Interest, Location } from "@/types";
import { MOCK_USERS } from "@/services/mockData";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  joinEvent: (eventId: string) => void;
  leaveEvent: (eventId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simulate checking for a stored session
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Update local storage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const foundUser = MOCK_USERS.find(user => user.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      setUser(foundUser);
      navigate("/");
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists
      const userExists = MOCK_USERS.some(user => user.email === email);
      
      if (userExists) {
        throw new Error("Email already in use");
      }
      
      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
        bio: "",
        location: null,
        interests: [],
        joinedEvents: [],
        connections: [],
        settings: {
          notifications: true,
          privacy: "public",
        },
        createdAt: new Date(),
      };
      
      // Add to mock data (in a real app, this would be saved to a database)
      // MOCK_USERS.push(newUser);
      
      setUser(newUser);
      navigate("/profile");
      toast({
        title: "Account created!",
        description: "Welcome to Renaissance!",
      });
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/auth");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const joinEvent = (eventId: string) => {
    if (!user) return;
    
    // Avoid duplicates
    if (user.joinedEvents.includes(eventId)) return;
    
    const updatedUser = { 
      ...user, 
      joinedEvents: [...user.joinedEvents, eventId] 
    };
    
    setUser(updatedUser);
  };

  const leaveEvent = (eventId: string) => {
    if (!user) return;
    
    const updatedUser = { 
      ...user, 
      joinedEvents: user.joinedEvents.filter(id => id !== eventId)
    };
    
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        logout,
        updateUserProfile,
        joinEvent,
        leaveEvent
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
