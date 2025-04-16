
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { INTERESTS } from "@/services/mockData";
import { Badge } from "@/components/ui/badge";
import LocationDetection from "@/components/location/LocationDetection";
import AgeRangeSelector from "@/components/profile/AgeRangeSelector";
import InterestSelector from "@/components/profile/InterestSelector";
import { ArrowLeft, Upload, Twitter, Instagram, Linkedin, Globe, Trash2, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Form schema for validation
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(300, "Bio must be less than 300 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Social profile type
interface SocialProfile {
  id: string;
  platform: "twitter" | "instagram" | "linkedin" | "website";
  url: string;
}

const platformIcons = {
  twitter: <Twitter className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  website: <Globe className="h-4 w-4" />,
};

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile, updateUserAgeRange, updateUserInterests } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([
    { id: "1", platform: "twitter", url: "" },
    { id: "2", platform: "instagram", url: "" },
  ]);
  const [isInterestsDialogOpen, setIsInterestsDialogOpen] = useState(false);

  // Initialize the form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      email: user?.email || "",
    },
  });

  // Load settings from localStorage
  useEffect(() => {
    if (user) {
      // Load stored values if available
      const storedName = localStorage.getItem("userName");
      const storedBio = localStorage.getItem("userBio");
      const storedAvatar = localStorage.getItem("userAvatar");
      
      if (storedName) form.setValue("name", storedName);
      if (storedBio) form.setValue("bio", storedBio);
      if (storedAvatar) setAvatar(storedAvatar);

      // Load user interests
      if (user.interests && user.interests.length > 0) {
        // Fix: Use a stable reference for interests that won't cause infinite re-renders
        const interestIds = user.interests.map(interest => interest.id);
        setSelectedInterests(interestIds);
      }

      // Load social profiles (this would need to be implemented in your user object)
      // This is a placeholder - you would typically load this from user data
      const storedSocialProfiles = localStorage.getItem("userSocialProfiles");
      if (storedSocialProfiles) {
        setSocialProfiles(JSON.parse(storedSocialProfiles));
      }
    }
  }, [user, form]);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const onSubmit = (data: ProfileFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const updatedProfile = {
        name: data.name,
        bio: data.bio,
        email: data.email,
        avatar
      };
      
      updateUserProfile(updatedProfile);
      
      // Save to localStorage for persistent memory
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userBio", data.bio);
      localStorage.setItem("userAvatar", avatar);
      localStorage.setItem("userSocialProfiles", JSON.stringify(socialProfiles));
      
      // Save interests
      updateUserInterests(selectedInterests);
      
      setIsSubmitting(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
      
      navigate("/profile");
    }, 800);
  };

  const handleAgeRangeChange = (ageRange: { min: number; max: number }) => {
    updateUserAgeRange(JSON.stringify(ageRange));
    // Save to localStorage
    localStorage.setItem("userAgeRange", JSON.stringify(ageRange));
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    const name = form.getValues("name");
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const handleInterestsChange = (interests: string[]) => {
    setSelectedInterests(interests);
  };

  const addSocialProfile = () => {
    setSocialProfiles([
      ...socialProfiles, 
      { 
        id: Date.now().toString(), 
        platform: "website", 
        url: "" 
      }
    ]);
  };

  const updateSocialProfile = (id: string, field: keyof SocialProfile, value: any) => {
    setSocialProfiles(profiles => 
      profiles.map(profile => 
        profile.id === id ? { ...profile, [field]: value } : profile
      )
    );
  };

  const removeSocialProfile = (id: string) => {
    setSocialProfiles(profiles => profiles.filter(profile => profile.id !== id));
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="flex items-center pt-6 px-4 mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2" 
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>
      
      <div className="px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 mb-2 border-2 border-primary/20 group-hover:border-primary/50 transition-all">
                  <AvatarImage 
                    src={avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=user"} 
                    alt={form.getValues("name") || "User"} 
                  />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/50 rounded-full w-full h-full flex items-center justify-center">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <Button type="button" variant="outline" size="sm" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </div>
            
            {/* Personal Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-primary">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your full name" 
                            {...field} 
                            className="focus-visible:ring-primary/30"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Your email address" 
                            {...field} 
                            disabled
                            className="bg-muted/50"
                          />
                        </FormControl>
                        <FormDescription>
                          Your email address cannot be changed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about yourself" 
                            {...field} 
                            rows={4}
                            className="focus-visible:ring-primary/30"
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0}/300 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Interests */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-primary">Your Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Select interests that match your preferences. We'll use these to suggest events and connect you with like-minded people.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedInterests.length > 0 ? (
                      INTERESTS
                        .filter(interest => selectedInterests.includes(interest.id))
                        .map(interest => (
                          <Badge 
                            key={interest.id}
                            variant="default"
                            className="bg-primary/20 text-primary hover:bg-primary/30 px-3 py-1"
                          >
                            {interest.name}
                          </Badge>
                        ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No interests selected</p>
                    )}
                  </div>
                  
                  <Dialog 
                    open={isInterestsDialogOpen} 
                    onOpenChange={setIsInterestsDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full mt-2 border-dashed"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Manage Interests
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Select Your Interests</DialogTitle>
                      </DialogHeader>
                      <InterestSelector
                        selectedInterests={selectedInterests}
                        onInterestsChange={handleInterestsChange}
                        onComplete={() => setIsInterestsDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <div className="text-xs text-muted-foreground">
                    Selected {selectedInterests.length} of {INTERESTS.length} interests
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Social Profiles */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-primary">Social Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Connect your social media accounts to share them on your profile.
                  </p>
                  
                  {socialProfiles.map((profile) => (
                    <div key={profile.id} className="flex items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-muted rounded-full p-1.5">
                            {platformIcons[profile.platform]}
                          </div>
                          <select
                            value={profile.platform}
                            onChange={(e) => updateSocialProfile(
                              profile.id, 
                              "platform", 
                              e.target.value as SocialProfile["platform"]
                            )}
                            className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-muted-foreground"
                          >
                            <option value="twitter">Twitter</option>
                            <option value="instagram">Instagram</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="website">Website</option>
                          </select>
                        </div>
                        <Input
                          value={profile.url}
                          onChange={(e) => updateSocialProfile(profile.id, "url", e.target.value)}
                          placeholder={`Your ${profile.platform} URL`}
                          className="focus-visible:ring-primary/30"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSocialProfile(profile.id)}
                        className="text-muted-foreground hover:text-destructive mt-7"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSocialProfile}
                    className="mt-2 w-full border-dashed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Social Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-primary">Age Range</CardTitle>
              </CardHeader>
              <CardContent>
                <AgeRangeSelector 
                  initialAgeRange={user.ageRange} 
                  onChange={handleAgeRangeChange} 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-primary">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <LocationDetection />
              </CardContent>
            </Card>
            
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                onClick={() => navigate("/profile")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-primary hover:bg-primary/90" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileEdit;
