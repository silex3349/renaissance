import { User, Interest, Group } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateUserInterests: (interests: string[]) => void;
  updateUserProfile: (profileData: Partial<User>) => void;
  updateUserLocation: (latitude: number, longitude: number) => void;
  updateUserAgeRange: (ageRange: string) => void;
  joinEvent: (eventId: string) => void;
  leaveEvent: (eventId: string) => void;
  likeUser: (userId: string) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  createGroup: (groupData: {
    name: string;
    description: string;
    isPrivate: boolean;
    interestIds: string[];
  }) => void;
  updateUserWatchlist: (watchlist: any) => void;
  requestJoinEvent: (eventId: string) => void;
  approveJoinRequest: (eventId: string, userId: string) => void;
  rejectJoinRequest: (eventId: string, userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  let notificationsContext;
  try {
    notificationsContext = useNotifications();
  } catch (error) {
    notificationsContext = {
      addNotification: () => {},
    };
  }
  const { addNotification } = notificationsContext;

  useEffect(() => {
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
      setTimeout(() => {
        const mockUser: User = {
          id: `user_${Date.now()}`,
          email,
          interests: [],
          joinedEvents: [],
          matchedUsers: [],
          joinedGroups: [],
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
      setTimeout(() => {
        const newUser: User = {
          id: `user_${Date.now()}`,
          email,
          interests: [],
          joinedEvents: [],
          matchedUsers: [],
          joinedGroups: [],
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
    
    const updatedUser = {
      ...user,
      interests: interestIds.map(id => 
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

  const updateUserProfile = (profileData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...profileData
    };
    
    setUser(updatedUser);
    localStorage.setItem("renaissanceUser", JSON.stringify(updatedUser));
  };

  const updateUserLocation = (latitude: number, longitude: number) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      location: { 
        city: "Detected City", 
        country: "Detected Country",
        latitude, 
        longitude 
      },
    };
    
    setUser(updatedUser);
    localStorage.setItem("renaissanceUser", JSON.stringify(updatedUser));
  };

  const updateUserAgeRange = (ageRangeStr: string) => {
    if (!user) return;
    
    try {
      const ageRange = JSON.parse(ageRangeStr);
      
      const updatedUser = {
        ...user,
        ageRange,
      };
      
      setUser(updatedUser);
      localStorage.setItem("renaissanceUser", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to parse age range:", error);
    }
  };

  const joinEvent = (eventId: string) => {
    if (!user) return;
    
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    
    if (event && event.isExclusive) {
      requestJoinEvent(eventId);
      return;
    }
    
    if (user.joinedEvents?.includes(eventId)) {
      return; // Already joined
    }
    
    const updatedUser = {
      ...user,
      joinedEvents: [...(user.joinedEvents || []), eventId]
    };
    
    setUser(updatedUser);
    localStorage.setItem("renaissanceUser", JSON.stringify(updatedUser));
    
    toast({
      title: "Event joined",
      description: "You have successfully joined this event",
    });
  };

  const requestJoinEvent = (eventId: string) => {
    if (!user) return;
    
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    if (!event) return;
    
    if (!event.pendingRequests) {
      event.pendingRequests = [];
    }
    
    if (event.pendingRequests.includes(user.id)) {
      toast({
        title: "Request pending",
        description: "Your request to join this event is already pending.",
      });
      return;
    }
    
    event.pendingRequests.push(user.id);
    
    if (addNotification) {
      addNotification({
        type: "joinRequest",
        message: `${user.email || 'Someone'} wants to join your event`,
        actionUrl: `/events/${eventId}`,
        userId: event.creator,
      });
    }
    
    toast({
      title: "Request sent",
      description: "Your request to join this event has been sent to the organizer.",
    });
  };
  
  const approveJoinRequest = (eventId: string, userId: string) => {
    if (!user) return;
    
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    if (!event || event.creator !== user.id) return;
    
    if (event.pendingRequests) {
      event.pendingRequests = event.pendingRequests.filter(id => id !== userId);
    }
    
    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId);
    }
    
    if (addNotification) {
      addNotification({
        type: "joinRequestApproved",
        message: `Your request to join "${event.title}" has been approved`,
        actionUrl: `/events/${eventId}`,
        userId: userId,
      });
    }
    
    toast({
      title: "Request approved",
      description: "The join request has been approved.",
    });
  };
  
  const rejectJoinRequest = (eventId: string, userId: string) => {
    if (!user) return;
    
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    if (!event || event.creator !== user.id) return;
    
    if (event.pendingRequests) {
      event.pendingRequests = event.pendingRequests.filter(id => id !== userId);
    }
    
    if (addNotification) {
      addNotification({
        type: "joinRequestRejected",
        message: `Your request to join "${event.title}" was not approved`,
        actionUrl: `/events/${eventId}`,
        userId: userId,
      });
    }
    
    toast({
      title: "Request rejected",
      description: "The join request has been rejected.",
    });
  };

  const leaveEvent = (eventId: string) => {
    if (!user || !user.joinedEvents) return;
    
    const updatedUser = {
      ...user,
      joinedEvents: user.joinedEvents.filter(id => id !== eventId)
    };
    
    setUser(updatedUser);
    localStorage.setItem("renaissanceUser", JSON.stringify(updatedUser));
    
    toast({
      title: "Event left",
      description: "You have been removed from this event",
    });
  };

  const likeUser = (userId: string) => {
    if (!user) return;
    
    if (user.matchedUsers?.includes(userId)) {
      return; // Already matched
    }
    
    const updatedUser = {
      ...user,
      matchedUsers: [...(user.matchedUsers || []), userId]
    };
    
    setUser(updatedUser);
    localStorage.setItem("renaissanceUser", JSON.stringify(updatedUser));
    
    toast({
      title: "User liked",
      description: "If they like you back, it's a match!",
    });
  };
  
  const joinGroup = (groupId: string) => {
    if (!user) return;
    
    if (user.joinedGroups?.includes(groupId)) {
      return; // Already joined
    }
    
    const updatedUser = {
      ...user,
      joinedGroups: [...(user.joinedGroups || []), groupId]
    };
    
    setUser(updatedUser);
    localStorage.setItem("renaissanceUser", JSON.stringify(updatedUser));
    
    if (addNotification) {
      addNotification({
        type: "joinedGroup",
        message: "You have joined a new group",
        actionUrl: `/groups/${groupId}`,
      });
    }
  };
  
  const leaveGroup = (groupId: string) => {
    if (!user || !user.joinedGroups) return;
    
    const updatedUser = {
      ...user,
      joinedGroups: user.joinedGroups.filter(id => id !== groupId)
    };
    
    setUser(updatedUser);
    localStorage.setItem("renaissanceUser", JSON.stringify(updatedUser));
  };
  
  const createGroup = (groupData: {
    name: string;
    description: string;
    isPrivate: boolean;
    interestIds: string[];
  }) => {
    if (!user) return;
    
    const newGroup: Group = {
      id: `group_${Date.now()}`,
      name: groupData.name,
      description: groupData.description,
      isPrivate: groupData.isPrivate,
      interests: groupData.interestIds.map(id => 
        INTERESTS.find(interest => interest.id === id) || { 
          id, 
          name: "Unknown Interest", 
          category: "Other" 
        }
      ),
      members: [user.id],
      createdAt: new Date(),
      creator: user.id,
      events: [],
    };
    
    const updatedUser = {
      ...user,
      joinedGroups: [...(user.joinedGroups || []), newGroup.id]
    };
    
    setUser(updatedUser);
    localStorage.setItem("renaissanceUser", JSON.stringify(updatedUser));
    
    MOCK_GROUPS.push(newGroup as any);
  };

  const updateUserWatchlist = (watchlist: any) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      watchlist
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
        updateUserProfile,
        updateUserLocation,
        updateUserAgeRange,
        joinEvent,
        leaveEvent,
        likeUser,
        joinGroup,
        leaveGroup,
        createGroup,
        updateUserWatchlist,
        requestJoinEvent,
        approveJoinRequest,
        rejectJoinRequest,
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

import { INTERESTS, MOCK_GROUPS, MOCK_EVENTS } from "@/services/mockData";
