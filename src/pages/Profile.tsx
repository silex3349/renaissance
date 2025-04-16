
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Edit2, Clock, Settings, LogOut, Camera, Users, FileText, Upload } from "lucide-react";
import { format } from "date-fns";
import { Event, User } from "@/types";
import { MOCK_EVENTS, MOCK_USERS } from "@/services/mockData";
import { supabase } from "@/lib/supabaseClient";
import { Progress } from "@/components/ui/progress";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileCompletion from "@/components/profile/ProfileCompletion";
import SocialLinks from "@/components/profile/SocialLinks";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { id } = useParams();
  const { user: authUser, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  
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
          // Get current date for comparison
          const now = new Date();
          
          // Ensure all required properties exist in the events
          const events = MOCK_EVENTS
            .filter(event => profileData?.joinedEvents.includes(event.id))
            .map(event => {
              // Make sure all required properties are present
              return {
                ...event,
                name: event.name || event.title, // Ensure name always exists
              } as Event;
            });
          
          // Split events into upcoming and past
          const upcoming = events.filter(event => new Date(event.dateTime) >= now);
          const past = events.filter(event => new Date(event.dateTime) < now);
          
          setJoinedEvents(upcoming);
          setPastEvents(past);
          
          if (profileData.bio) {
            setEditedBio(profileData.bio);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [id, authUser, isOwnProfile]);

  const handleSaveBio = () => {
    if (isOwnProfile && profile) {
      updateUserProfile({ bio: editedBio });
      setProfile({ ...profile, bio: editedBio });
      setIsEditingBio(false);
      toast({
        title: "Bio updated",
        description: "Your bio has been successfully updated."
      });
    }
  };
  
  const handleLogout = async () => {
    if (supabaseUser) {
      await supabase.auth.signOut();
    }
    logout();
  };
  
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

  const displayName = supabaseUser
    ? (supabaseUser.user_metadata?.full_name || userName)
    : (profile?.name || userName);
    
  const userBio = supabaseUser
    ? (supabaseUser.user_metadata?.bio || "")
    : (profile?.bio || "");
    
  const userEmail = supabaseUser ? supabaseUser.email : profile?.email;
  
  const userJoinDate = supabaseUser 
    ? new Date(supabaseUser.created_at) 
    : (profile?.createdAt || new Date());

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const totalFields = 4; // Name, Bio, Email, Interests
    let completedFields = 0;
    
    if (displayName && displayName !== "Anonymous User") completedFields++;
    if (userBio && userBio.trim() !== "") completedFields++;
    if (userEmail) completedFields++;
    if (profile?.interests && profile.interests.length > 0) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };
  
  const profileCompletion = calculateProfileCompletion();
  
  return (
    <div className="container py-8 px-4 md:px-8">
      <Card className="shadow-md border rounded-xl overflow-hidden">
        <CardHeader className="relative pt-8 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div 
              className="relative group"
              onMouseEnter={() => setIsHoveringAvatar(true)}
              onMouseLeave={() => setIsHoveringAvatar(false)}
            >
              <Avatar className="w-24 h-24 border-2 border-primary mb-2 sm:mb-0 transition-all hover:opacity-90">
                {supabaseUser ? (
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/big-ears-neutral/svg?seed=${userEmail}`} 
                    alt={userName} 
                  />
                ) : (
                  <AvatarImage src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" />
                )}
                <AvatarFallback>
                  {displayName 
                    ? displayName.split(" ").map(n => n[0]).join("").toUpperCase()
                    : userEmail.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {isOwnProfile && isHoveringAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                  <Upload className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <CardTitle className="text-2xl font-bold">
                {displayName}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{userEmail}</p>
              
              <CardDescription className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-2">
                {profile?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {profile.location.city}, {profile.location.country}
                  </span>
                )}
                
                <Badge variant="outline" className="flex items-center gap-1 font-normal">
                  <Clock className="h-3 w-3" />
                  Joined {format(userJoinDate, "MMMM yyyy")}
                </Badge>
              </CardDescription>
              
              {isOwnProfile && profileCompletion < 100 && (
                <ProfileCompletion completion={profileCompletion} />
              )}
            </div>
          </div>
          
          {isOwnProfile && (
            <div className="absolute right-6 top-6 flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigate("/profile/edit")}
                className="transition-colors hover:bg-primary/10"
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        
        {isOwnProfile && (
          <div className="px-6 mb-4">
            <ProfileStats 
              followers={85} 
              following={134} 
              posts={24} 
              events={joinedEvents.length + pastEvents.length} 
            />
          </div>
        )}
        
        <CardContent className="pt-0">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="about" 
                className="transition-colors hover:text-primary"
              >
                About
              </TabsTrigger>
              <TabsTrigger 
                value="events"
                className="transition-colors hover:text-primary"
              >
                Events
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="pt-4 space-y-6">
              <div className="space-y-5">
                <div>
                  <h3 className="font-medium text-sm mb-2 text-muted-foreground">Bio</h3>
                  {isEditingBio && isOwnProfile ? (
                    <div className="space-y-2">
                      <Textarea 
                        value={editedBio} 
                        onChange={(e) => setEditedBio(e.target.value)}
                        placeholder="Tell the community about yourself..."
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setIsEditingBio(false);
                            setEditedBio(userBio);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm"
                          onClick={handleSaveBio}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`${isOwnProfile ? "cursor-pointer hover:bg-muted/50 p-2 rounded-md -ml-2" : ""}`}
                      onClick={() => isOwnProfile && setIsEditingBio(true)}
                    >
                      {userBio ? (
                        <p>{userBio}</p>
                      ) : (
                        <p className="text-muted-foreground italic">
                          {isOwnProfile 
                            ? "Tell the community a bit about yourself. Click to add a bio."
                            : "No bio provided."}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-2 text-muted-foreground">Interests</h3>
                  {profile?.interests && profile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map(interest => (
                        <Badge key={interest.id} variant="secondary" className="rounded-full">
                          {interest.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div 
                      className={`${isOwnProfile ? "cursor-pointer hover:bg-muted/50 p-2 rounded-md -ml-2" : ""}`}
                      onClick={() => isOwnProfile && navigate("/profile/edit")}
                    >
                      <p className="text-muted-foreground italic">
                        {isOwnProfile 
                          ? "Add your interests to connect with like-minded people. Click to add."
                          : "No interests added yet."}
                      </p>
                    </div>
                  )}
                </div>
                
                {isOwnProfile && (
                  <SocialLinks />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="pt-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-sm mb-2 text-muted-foreground">Upcoming Events</h3>
                  
                  {joinedEvents.length > 0 ? (
                    <div className="grid gap-4">
                      {joinedEvents.map(event => (
                        <Card key={event.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
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
                
                <div>
                  <h3 className="font-medium text-sm mb-2 text-muted-foreground">Past Events</h3>
                  
                  {pastEvents.length > 0 ? (
                    <div className="grid gap-4">
                      {pastEvents.map(event => (
                        <Card key={event.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
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
                    <p className="text-muted-foreground">No past events.</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
