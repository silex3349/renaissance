
import { useState, useEffect, useRef } from "react";
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
import { ArrowLeft, Upload, Twitter, Instagram, Linkedin, Globe, Trash2, Plus, Camera, X } from "lucide-react";
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

const platformLabels = {
  twitter: "Twitter Profile URL",
  instagram: "Instagram Profile URL",
  linkedin: "LinkedIn Profile URL",
  website: "Website URL",
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
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to your server/storage
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      
      // Reset the input so the same file can be selected again if needed
      e.target.value = '';
      
      toast({
        title: "Photo uploaded",
        description: "Your profile photo has been updated."
      });
    }
  };

  const removeAvatar = () => {
    setAvatar("");
    toast({
      title: "Photo removed",
      description: "Your profile photo has been removed."
    });
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
            {/* Avatar Section - Improved */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div 
                  className="relative cursor-pointer"
                  onMouseEnter={() => setIsHoveringAvatar(true)}
                  onMouseLeave={() => setIsHoveringAvatar(false)}
                  onClick={handleAvatarClick}
                >
                  <Avatar className="h-28 w-28 mb-2 border-2 border-primary/20 group-hover:border-primary/50 transition-all">
                    {avatar ? (
                      <AvatarImage 
                        src={avatar} 
                        alt={form.getValues("name") || "User"} 
                      />
                    ) : (
                      <AvatarFallback className="bg-muted flex items-center justify-center">
                        <Camera className="h-10 w-10 text-muted-foreground opacity-50" />
                      </AvatarFallback>
                    )}
                    {!avatar && <AvatarFallback>{getUserInitials()}</AvatarFallback>}
                  </Avatar>
                  
                  {isHoveringAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                      <Camera className="h-10 w-10 text-white" />
                    </div>
                  )}
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              
              <div className="flex gap-2 mt-2">
                <Button type="button" variant="outline" size="sm" onClick={handleAvatarClick}>
                  <Camera className="h-4 w-4 mr-2" />
                  {avatar ? "Change Photo" : "Upload Photo"}
                </Button>
                
                {avatar && (
                  <Button type="button" variant="outline" size="sm" onClick={removeAvatar} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
            
            {/* Personal Information - Improved */}
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
                            className="focus-visible:ring-primary/30 focus-visible:border-primary"
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
                            placeholder="Tell the community about yourself..." 
                            {...field} 
                            rows={4}
                            className="focus-visible:ring-primary/30 focus-visible:border-primary min-h-[100px]"
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
            
            {/* Interests - Improved */}
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
                            <button 
                              onClick={(e) => {
                                e.preventDefault(); // Prevent form submission
                                handleInterestsChange(selectedInterests.filter(id => id !== interest.id));
                              }}
                              className="ml-2 text-primary/70 hover:text-primary"
                            >
                              <X className="h-3 w-3" />
                            </button>
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
            
            {/* Social Profiles - Improved */}
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
                    <div key={profile.id} className="space-y-3 p-3 border rounded-lg hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
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
                            className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                          >
                            <option value="twitter">Twitter</option>
                            <option value="instagram">Instagram</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="website">Website</option>
                          </select>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSocialProfile(profile.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Input
                        value={profile.url}
                        onChange={(e) => updateSocialProfile(profile.id, "url", e.target.value)}
                        placeholder={platformLabels[profile.platform]}
                        className="focus-visible:ring-primary/30 focus-visible:border-primary"
                      />
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
            
            {/* Age Range - Improved */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-primary">Age Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Choose the age range you're interested in connecting with
                  </p>
                  <AgeRangeSelector 
                    initialAgeRange={user.ageRange} 
                    onChange={handleAgeRangeChange} 
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Location - Improved */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-primary">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Share your location to connect with people and events near you
                  </p>
                  <LocationDetection />
                </div>
              </CardContent>
            </Card>
            
            {/* Save & Cancel Buttons - Improved */}
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
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all" 
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
