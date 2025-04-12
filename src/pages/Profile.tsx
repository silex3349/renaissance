
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import InterestSelector from "@/components/profile/InterestSelector";
import LocationDetection from "@/components/location/LocationDetection";
import AgeRangeSelector from "@/components/profile/AgeRangeSelector";
import { Settings, Search, Plus, MessageSquare, Share2, Edit } from "lucide-react";
import { MOCK_EVENTS } from "@/services/mockData";
import { Event } from "@/types";
import EventCard from "@/components/events/EventCard";

const Profile = () => {
  const { user, updateUserAgeRange } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("saved");
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Simulate loading saved events
    // In a real app, this would come from an API or user data
    setSavedEvents(MOCK_EVENTS.slice(0, 4) as Event[]);
  }, []);

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
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user.name) return "U";
    return user.name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header section with avatar and basic info */}
      <div className="pt-6 pb-4 px-4">
        <div className="flex justify-between items-center mb-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
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
          
          <Button variant="outline" className="mb-6" onClick={() => window.location.href = "/profile/edit"}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          
          <div className="w-full max-w-md">
            <Tabs defaultValue="saved" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="saved" className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Saved Events</h2>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {savedEvents.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {savedEvents.map(event => (
                        <div key={event.id} className="aspect-square overflow-hidden rounded-xl relative group">
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
                      <Button variant="outline" className="mt-4" onClick={() => window.location.href = "/events"}>
                        Discover Events
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="pt-4 space-y-6">
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Interests</h3>
                  <InterestSelector />
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Age Range</h3>
                  <AgeRangeSelector 
                    initialAgeRange={user.ageRange} 
                    onChange={handleAgeRangeChange} 
                  />
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Location</h3>
                  <LocationDetection />
                </Card>
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
