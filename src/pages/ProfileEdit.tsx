
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { INTERESTS } from "@/services/mockData";
import { Badge } from "@/components/ui/badge";
import LocationDetection from "@/components/location/LocationDetection";
import AgeRangeSelector from "@/components/profile/AgeRangeSelector";
import InterestSelector from "@/components/profile/InterestSelector";
import { Plus, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ProfileEditHeader from "@/components/profile/ProfileEditHeader";
import AvatarUpload from "@/components/profile/AvatarUpload";
import SocialProfilesSection from "@/components/profile/SocialProfilesSection";

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

  const handleSocialProfilesChange = (profiles: SocialProfile[]) => {
    setSocialProfiles(profiles);
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <ProfileEditHeader />
      
      <div className="px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <AvatarUpload 
              initialAvatar={avatar} 
              onAvatarChange={setAvatar} 
              userInitials={getUserInitials()} 
            />
            
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
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                      <DialogHeader>
                        <DialogTitle>Select Your Interests</DialogTitle>
                      </DialogHeader>
                      <div className="flex-1 overflow-y-auto py-2">
                        <InterestSelector
                          selectedInterests={selectedInterests}
                          onInterestsChange={handleInterestsChange}
                          onComplete={() => setIsInterestsDialogOpen(false)}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="text-xs text-muted-foreground">
                    Selected {selectedInterests.length} of {INTERESTS.length} interests
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Social Profiles */}
            <SocialProfilesSection 
              initialProfiles={socialProfiles} 
              onChange={handleSocialProfilesChange} 
            />
            
            {/* Age Range */}
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
            
            {/* Location */}
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
            
            {/* Save & Cancel Buttons */}
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
