
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, ChevronsRight, MapPin, UserPlus } from "lucide-react";
import InterestSelector from "@/components/profile/InterestSelector";
import { motion } from "framer-motion";
import { Interest } from "@/types";

interface OnboardingStep {
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    title: "Welcome to Renaissance",
    description: "Let's set up your profile so you can start connecting with people who share your interests.",
  },
  {
    title: "About You",
    description: "Help others get to know you better.",
  },
  {
    title: "Your Interests",
    description: "Select interests to connect with like-minded people.",
  },
  {
    title: "Almost Done",
    description: "Review your profile before finishing.",
  },
];

const OnboardingScreen: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location?.city || "");
  const [interests, setInterests] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const interestObjects: Interest[] = interests.map(interest => ({
        id: interest,
        name: interest,
        category: "General" // Include the required category field
      }));
      
      const updatedProfile = {
        name,
        bio,
        location: { city: location, country: "Unknown" },
        interests: interestObjects
      };
      
      updateUserProfile(updatedProfile);
      navigate("/");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-12 h-12 text-orange-500" />
            </div>
            <CardDescription className="text-lg">
              Connect with people who share your interests in a minimal-profile environment.
            </CardDescription>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="mx-auto relative w-24 h-24 cursor-pointer group" onClick={() => document.getElementById("avatar-upload")?.click()}>
              <Avatar className="w-24 h-24 border-2 border-primary">
                <AvatarImage src={uploadedImage || undefined} />
                <AvatarFallback className="text-2xl bg-orange-100 text-orange-500">
                  {name ? getInitials(name) : user?.email?.[0].toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <p className="text-white text-xs font-medium">Change Photo</p>
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How would you like to be called?"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others a bit about yourself"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Your city"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <CardDescription>
              Select at least 3 interests to help us connect you with like-minded people and relevant events.
            </CardDescription>
            <InterestSelector 
              selectedInterests={interests}
              onInterestsChange={setInterests}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="mx-auto w-24 h-24">
              <Avatar className="w-24 h-24 border-2 border-primary">
                <AvatarImage src={uploadedImage || undefined} />
                <AvatarFallback className="text-2xl bg-orange-100 text-orange-500">
                  {name ? getInitials(name) : user?.email?.[0].toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-sm">Display Name</Label>
                <p className="font-medium">{name || "Not provided"}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground text-sm">Bio</Label>
                <p>{bio || "Not provided"}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground text-sm">Location</Label>
                <p className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {location || "Not provided"}
                </p>
              </div>
              
              <div>
                <Label className="text-muted-foreground text-sm">Interests</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {interests.length > 0 ? (
                    interests.map((interest) => (
                      <div
                        key={interest}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No interests selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-md mx-auto shadow-md border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <div className="flex items-center gap-2">
            {Array.from({ length: steps.length }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep
                    ? "bg-primary"
                    : index < currentStep
                    ? "bg-primary/50"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
        <CardDescription>{steps[currentStep].description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div>
          {currentStep > 0 ? (
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={handleSkip}>
              Skip
            </Button>
          )}
        </div>
        
        <Button onClick={handleNext} className="gap-2">
          {currentStep === steps.length - 1 ? (
            <>
              Complete <Check className="h-4 w-4" />
            </>
          ) : (
            <>
              Continue <ChevronsRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OnboardingScreen;
