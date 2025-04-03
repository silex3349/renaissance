
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import InterestSelector from "@/components/profile/InterestSelector";
import LocationDetection from "@/components/location/LocationDetection";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 2;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Onboarding complete
      navigate("/discover");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Welcome to Renaissance</h2>
          <p className="text-muted-foreground">Let's set up your profile to help you connect</p>
          
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i} 
                className={`h-2 w-12 rounded-full ${
                  i + 1 === step ? "bg-primary" : i + 1 < step ? "bg-muted-foreground" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            {step === 1 && (
              <InterestSelector onComplete={handleNext} />
            )}
            
            {step === 2 && (
              <LocationDetection onComplete={handleNext} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
