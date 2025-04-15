
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Edit2, Clock, Settings, LogOut } from "lucide-react";
import { format } from "date-fns";
import { Event, User } from "@/types";
import { MOCK_EVENTS, MOCK_USERS } from "@/services/mockData";
import { supabase } from "@/lib/supabaseClient";

const Profile = () => {
  const { id } = useParams();
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  
  const isOwnProfile = !id || (authUser && id === authUser.id);
  
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // First try to get Supabase user data
        const { data: { user } } = await supabase.auth.getUser();
        setSupabaseUser(user);
        
        let profileData: User | null = null;
        
        // If viewing own profile or no ID provided, use current user
        if (isOwnProfile && authUser) {
          profileData = authUser;
        } 
        // If viewing another user's profile
        else if (id) {
          // Simulate API call to fetch profile by ID
          await new Promise(resolve => setTimeout(resolve, 500));
          profileData = MOCK_USERS.find(u => u.id === id) || null;
        }
        
        setProfile(profileData);
        
        // Fetch events this user is attending
        if (profileData) {
          // Ensure all required properties exist in the events
          const validEvents = MOCK_EVENTS
            .filter(event => profileData?.joinedEvents.includes(event.id))
            .map(event => {
              // Make sure all required properties are present
              return {
                ...event,
                name: event.name || event.title, // Ensure name always exists
              } as Event;
            });
            
          setJoinedEvents(validEvents);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [id, authUser, isOwnProfile]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-pulse text-muted-foreground">Loading profile...</div>
      </div>
    );
  }
  
  // Use Supabase user data if available, otherwise fall back to legacy data
  const displayUser = supabaseUser || profile;
  
  if (!displayUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-2xl font-bold">Profile Not Found</h2>
        <p className="text-muted-foreground">The profile you're looking for doesn't exist or was removed.</p>
        <Button 
          variant="default" 
          className="mt-4"
          onClick={() => navigate("/")}
        >
          Go to Home Page
        </Button>
      </div>
    );
  }
  
  // Handle different profile data structures (Supabase vs existing)
  const userName = supabaseUser 
    ? (supabaseUser.user_metadata?.username || supabaseUser.email.split("@")[0]) 
    : (profile?.name || "Anonymous User");
    
  const userBio = supabaseUser
    ? (supabaseUser.user_metadata?.bio || "No bio provided.")
    : (profile?.bio || "No bio provided.");
    
  const userEmail = supabaseUser ? supabaseUser.email : profile?.email;
  
  const userJoinDate = supabaseUser 
    ? new Date(supabaseUser.created_at) 
    : (profile?.createdAt || new Date());
  
  const handleLogout = async () => {
    if (supabaseUser) {
      await supabase.auth.signOut();
    }
    logout();
  };
  
  return (
    <div className="container py-8">
      <Card className="shadow-md border">
        <CardHeader className="relative pb-0">
          {isOwnProfile && (
            <div className="absolute right-6 top-6 flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigate("/profile/edit")}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigate("/profile/settings")}
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="w-24 h-24 border-2 border-primary">
              {supabaseUser ? (
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/big-ears-neutral/svg?seed=${userEmail}`} 
                  alt={userName} 
                />
              ) : (
                <AvatarImage src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" />
              )}
              <AvatarFallback>
                {userName 
                  ? userName.split(" ").map(n => n[0]).join("").toUpperCase()
                  : userEmail.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl font-bold">
                {userName}
              </CardTitle>
              
              <CardDescription className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-1">
                {profile?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {profile.location.city}, {profile.location.country}
                  </span>
                )}
                
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Joined {format(userJoinDate, "MMMM yyyy")}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="interests">Interests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm mb-1">Bio</h3>
                  <p className="text-muted-foreground">{userBio}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-1">Email</h3>
                  <p className="text-muted-foreground">{userEmail}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="pt-4">
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Upcoming Events</h3>
                
                {joinedEvents.length > 0 ? (
                  <div className="grid gap-4">
                    {joinedEvents.map(event => (
                      <Card key={event.id} className="overflow-hidden border-0 shadow-sm">
                        <div className="flex flex-col sm:flex-row">
                          <div 
                            className="w-full sm:w-24 h-24 bg-cover bg-center"
                            style={{ backgroundImage: `url(https://picsum.photos/seed/${event.id}/200/200)` }}
                          ></div>
                          <div className="p-4">
                            <h4 className="font-medium">{event.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(event.dateTime), "EEE, MMM d, yyyy • h:mm a")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location.city}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Not attending any upcoming events.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="interests" className="pt-4">
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Interests</h3>
                
                {profile?.interests && profile.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map(interest => (
                      <Badge key={interest.id} variant="secondary" className="rounded-full">
                        {interest.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No interests added yet.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        {isOwnProfile && (
          <CardFooter className="flex justify-center sm:justify-start pt-0">
            <Button 
              variant="default" 
              className="mt-4"
              onClick={() => navigate("/profile/edit")}
            >
              Edit Profile
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Profile;
