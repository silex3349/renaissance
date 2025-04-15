
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import InterestSelector from "@/components/profile/InterestSelector";
import LocationDetection from "@/components/location/LocationDetection";
import AgeRangeSelector from "@/components/profile/AgeRangeSelector";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight, Users, MapPin, Calendar } from "lucide-react";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { updateUserAgeRange } = useAuth();
  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Onboarding complete
      navigate("/discover");
    }
  };

  const handleAgeRangeChange = (ageRange: { min: number; max: number }) => {
    // Store the age range in the user's profile
    updateUserAgeRange(JSON.stringify(ageRange));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 bg-gradient-to-b from-purple-900 to-purple-800">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2 text-white">Welcome to Renaissance</h2>
          <p className="text-purple-200">Let's set up your profile to help you connect</p>
          
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  i + 1 === step ? "bg-white w-8" : 
                  i + 1 < step ? "bg-purple-300 w-6" : "bg-purple-700 w-4"
                }`}
              />
            ))}
          </div>
        </div>
        
        <Card className="bg-white/95 backdrop-blur-sm border-none shadow-lg">
          <CardContent className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Users className="h-6 w-6 text-purple-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Select Your Interests</h3>
                    <p className="text-muted-foreground">Choose what you enjoy doing</p>
                  </div>
                </div>
                
                <div className="pb-4">
                  <InterestSelector />
                </div>
                
                <Button 
                  onClick={handleNext} 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Age Preference</h3>
                    <p className="text-muted-foreground">Set your preferred age range</p>
                  </div>
                </div>
                
                <div className="pb-4">
                  <AgeRangeSelector 
                    onChange={handleAgeRangeChange}
                  />
                </div>
                
                <Button 
                  onClick={handleNext} 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <MapPin className="h-6 w-6 text-purple-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Your Location</h3>
                    <p className="text-muted-foreground">Find events and people near you</p>
                  </div>
                </div>
                
                <div className="pb-4">
                  <LocationDetection />
                </div>
                
                <Button 
                  onClick={handleNext} 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Get Started <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {step > 1 && (
          <div className="mt-4 text-center">
            <button 
              onClick={() => setStep(step - 1)}
              className="text-purple-200 hover:text-white"
            >
              Go back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
