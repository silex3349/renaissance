
import { User } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateUserInterests: (interests: string[]) => void;
  updateUserLocation: (latitude: number, longitude: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("renaissanceUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("renaissanceUser");
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication - in a real app, this would call your auth backend
      setTimeout(() => {
        const mockUser: User = {
          id: `user_${Date.now()}`,
          email,
          interests: [],
          joinedEvents: [],
          matchedUsers: [],
          createdAt: new Date(),
        };
        
        setUser(mockUser);
        localStorage.setItem("renaissanceUser", JSON.stringify(mockUser));
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock registration - in a real app, this would call your auth backend
      setTimeout(() => {
        const newUser: User = {
          id: `user_${Date.now()}`,
          email,
          interests: [],
          joinedEvents: [],
          matchedUsers: [],
          createdAt: new Date(),
        };
        
        setUser(newUser);
        localStorage.setItem("renaissanceUser", JSON.stringify(newUser));
        toast({
          title: "Account created!",
          description: "Your account has been successfully created.",
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Registration failed",
        description: "Unable to create your account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("renaissanceUser");
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const updateUserInterests = (interestIds: string[]) => {
    if (!user) return;
    
    // In a real app, this would call your backend
    const updatedUser = {
      ...user,
      interests: interestIds.map(id => 
        // Find the interest in our mock data
        INTERESTS.find(interest => interest.id === id) || { 
          id, 
          name: "Unknown Interest", 
          category: "Other" 
        }
      ),
    };
    
    setUser(updatedUser);
    localStorage.setItem("renaissanceUser", JSON.stringify(updatedUser));
  };

  const updateUserLocation = (latitude: number, longitude: number) => {
    if (!user) return;
    
    // In a real app, this would call your backend
    const updatedUser = {
      ...user,
      location: { latitude, longitude },
    };
    
    setUser(updatedUser);
    localStorage.setItem("renaissanceUser", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateUserInterests,
        updateUserLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Import from services at the end to avoid circular dependencies
import { INTERESTS } from "@/services/mockData";
