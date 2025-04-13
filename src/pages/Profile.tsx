
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import InterestSelector from "@/components/profile/InterestSelector";
import LocationDetection from "@/components/location/LocationDetection";
import AgeRangeSelector from "@/components/profile/AgeRangeSelector";
import { Settings, Search, Plus, MessageSquare, Edit } from "lucide-react";
import { MOCK_EVENTS } from "@/services/mockData";
import { Event } from "@/types";
import EventCard from "@/components/events/EventCard";

const Profile = () => {
  const { user, updateUserAgeRange } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("saved");
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    // Responsive layout detection
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Simulate loading saved events
    // In a real app, this would come from an API or user data
    setSavedEvents(MOCK_EVENTS.slice(0, 4) as Event[]);
  }, []);

  // Save login state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("isLoggedIn", "true");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="renaissance-container py-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Profile Not Available</h1>
        <p className="text-muted-foreground mb-4">Please sign in to view your profile.</p>
        <Button asChild>
          <a href="/signin">Sign In</a>
        </Button>
      </div>
    );
  }

  const handleAgeRangeChange = (ageRange: { min: number; max: number }) => {
    updateUserAgeRange(JSON.stringify(ageRange));
    
    // Save settings to localStorage
    localStorage.setItem("userAgeRange", JSON.stringify(ageRange));
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user.name) return "U";
    return user.name.split(" ").map(n => n[0]).join("").toUpperCase();
  };
  
  const goToSettings = () => {
    navigate("/profile/edit");
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header section with avatar and basic info */}
      <div className="pt-6 pb-4 px-4">
        <div className="flex justify-between items-center mb-2">
          <Button variant="ghost" size="icon" onClick={goToSettings}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=user"} alt={user.name || "User"} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          
          <h1 className="text-2xl font-bold mb-1">{user.name || "User Name"}</h1>
          <p className="text-muted-foreground mb-2">{user.email}</p>
          
          {user.bio && (
            <p className="text-sm text-center max-w-xs mx-auto mb-3">{user.bio}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div>
              <span className="font-semibold text-foreground">{user.joinedEvents?.length || 0}</span> events
            </div>
            <div>
              <span className="font-semibold text-foreground">{user.matchedUsers?.length || 0}</span> connections
            </div>
            <div>
              <span className="font-semibold text-foreground">{user.joinedGroups?.length || 0}</span> groups
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="mb-6" 
            onClick={() => navigate("/profile/edit")}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          
          <div className="w-full max-w-md">
            <Tabs defaultValue="saved" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-1 w-full">
                <TabsTrigger value="saved">Saved & Watchlist</TabsTrigger>
              </TabsList>
              
              <TabsContent value="saved" className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Saved Events</h2>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {savedEvents.length > 0 ? (
                    <div className={`grid ${isDesktop ? 'md:grid-cols-3 sm:grid-cols-2' : 'grid-cols-2'} gap-4`}>
                      {savedEvents.map(event => (
                        <div 
                          key={event.id} 
                          className="aspect-square overflow-hidden rounded-xl relative group cursor-pointer"
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          <div 
                            className="w-full h-full bg-cover bg-center"
                            style={{ 
                              backgroundImage: event.imageUrl 
                                ? `url(${event.imageUrl})` 
                                : 'url(https://images.unsplash.com/photo-1528605248644-14dd04022da1)' 
                            }}
                          >
                            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200"></div>
                            <div className="absolute bottom-2 left-2 right-2">
                              <p className="text-white text-sm font-medium truncate">{event.title}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No saved events yet</p>
                      <Button variant="outline" className="mt-4" onClick={() => navigate("/events")}>
                        Discover Events
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2">
        <div className="flex justify-around items-center">
          <a href="/events" className="flex flex-col items-center p-2 text-muted-foreground hover:text-foreground">
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Discover</span>
          </a>
          <a href="/events/create" className="flex flex-col items-center p-2 text-muted-foreground hover:text-foreground">
            <Plus className="h-6 w-6" />
            <span className="text-xs mt-1">Create</span>
          </a>
          <a href="/chats" className="flex flex-col items-center p-2 text-muted-foreground hover:text-foreground">
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs mt-1">Messages</span>
          </a>
          <a href="/profile" className="flex flex-col items-center p-2 text-foreground">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatar} alt={user.name || "User"} />
              <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
            </Avatar>
            <span className="text-xs mt-1">Profile</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
