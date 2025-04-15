import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User, Interest } from "@/types";
import { MOCK_USERS } from "@/services/mockData";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signUpWithSocial: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  signOut: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  joinEvent: (eventId: string) => void;
  leaveEvent: (eventId: string) => void;
  updateUserInterests: (interests: string[]) => void;
  updateUserLocation: (latitude: number, longitude: number) => void;
  updateUserAgeRange: (ageRange: string) => void;
  updateUserWatchlist: (watchlist: any) => void;
  createGroup: (groupData: any) => void;
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userExists = MOCK_USERS.some(user => user.email === email);
      
      if (userExists) {
        throw new Error("Email already in use");
      }
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
        bio: "",
        location: null,
        interests: [],
        joinedEvents: [],
        matchedUsers: [],
        joinedGroups: [],
        settings: {
          notifications: true,
          privacy: "public",
        },
        createdAt: new Date(),
      };
      
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

  const signUpWithSocial = async (userData: Partial<User>) => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: userData.id || `user_${Date.now()}`,
        email: userData.email || `user_${Date.now()}@example.com`,
        name: userData.name || "New User",
        bio: userData.bio || "",
        profileImageUrl: userData.profileImageUrl,
        interests: userData.interests || [],
        joinedEvents: userData.joinedEvents || [],
        matchedUsers: userData.matchedUsers || [],
        joinedGroups: userData.joinedGroups || [],
        location: userData.location || null,
        createdAt: new Date(),
        settings: userData.settings || {
          notifications: true,
          privacy: "public",
        },
      };
      
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

  const updateUserInterests = (interests: string[]) => {
    if (!user) return;
    
    const interestObjects: Interest[] = interests.map(id => ({
      id,
      name: id,
      category: "General" // Add the required category field
    }));
    
    const updatedUser = { 
      ...user, 
      interests: interestObjects
    };
    
    setUser(updatedUser);
    
    toast({
      title: "Interests updated",
      description: "Your interests have been updated successfully.",
    });
  };

  const updateUserLocation = (latitude: number, longitude: number) => {
    if (!user) return;
    
    const updatedUser = { 
      ...user, 
      location: {
        city: "New City",
        country: "Country",
        latitude,
        longitude
      }
    };
    
    setUser(updatedUser);
  };

  const updateUserAgeRange = (ageRange: string) => {
    if (!user) return;
    
    try {
      const parsedRange = JSON.parse(ageRange);
      const updatedUser = { 
        ...user, 
        ageRange: parsedRange
      };
      
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to parse age range:", error);
    }
  };

  const updateUserWatchlist = (watchlist: any) => {
    if (!user) return;
    
    const updatedUser = { 
      ...user, 
      watchlist
    };
    
    setUser(updatedUser);
  };

  const createGroup = (groupData: any) => {
    toast({
      title: "Group created",
      description: `Your group "${groupData.name}" has been created.`,
    });
  };

  const signOut = logout;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signUpWithSocial,
        logout,
        updateUserProfile,
        joinEvent,
        leaveEvent,
        updateUserInterests,
        updateUserLocation,
        updateUserAgeRange,
        updateUserWatchlist,
        createGroup,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
