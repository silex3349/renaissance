
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import InterestSelector from "@/components/profile/InterestSelector";
import LocationDetection from "@/components/location/LocationDetection";
import AgeRangeSelector from "@/components/profile/AgeRangeSelector";
import { ArrowLeft, Upload } from "lucide-react";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile, updateUserAgeRange } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const updatedProfile = {
        name,
        bio,
        email,
        avatar
      };
      
      updateUserProfile(updatedProfile);
      
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
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="pt-6 px-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mb-4" 
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=user"} alt={name || "User"} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            
            <Button type="button" variant="outline" size="sm" className="mt-2">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </div>
          
          {/* Basic Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Your email address"
                    disabled
                  />
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
                  <Textarea 
                    id="bio" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Preferences */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Interests</h3>
              <InterestSelector />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Age Range</h3>
              <AgeRangeSelector 
                initialAgeRange={user.ageRange} 
                onChange={handleAgeRangeChange} 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Location</h3>
              <LocationDetection />
            </CardContent>
          </Card>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
