
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ageRanges = [
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65+"
];

const AgeRangeSelector = ({ onComplete }: { onComplete?: () => void }) => {
  const { user, updateUserAgeRange } = useAuth();
  const { toast } = useToast();
  const [selectedRange, setSelectedRange] = useState<string>(user?.ageRange || "");

  useEffect(() => {
    if (user?.ageRange) {
      setSelectedRange(user.ageRange);
    }
  }, [user]);

  const handleSave = () => {
    if (!selectedRange) {
      toast({
        title: "Selection required",
        description: "Please select an age range to continue",
        variant: "destructive",
      });
      return;
    }

    updateUserAgeRange(selectedRange);
    toast({
      title: "Age range updated",
      description: "Your age range has been saved successfully",
    });
    
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-6 p-4 animate-fade-in">
      <div className="space-y-2">
        <h3 className="text-xl font-medium">Select Your Age Range</h3>
        <p className="text-muted-foreground">
          This information helps us recommend relevant events and activities. It won't be shown to other users.
        </p>
      </div>
      
      <RadioGroup 
        value={selectedRange} 
        onValueChange={setSelectedRange}
        className="grid grid-cols-2 gap-4"
      >
        {ageRanges.map((range) => (
          <div key={range} className="space-y-1">
            <RadioGroupItem
              value={range}
              id={`age-${range}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`age-${range}`}
              className="flex flex-col items-center justify-center border rounded-md p-4 
              hover:bg-accent cursor-pointer peer-data-[state=checked]:border-primary
              peer-data-[state=checked]:bg-primary/10"
            >
              {range}
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      <Button 
        className="w-full mt-8" 
        onClick={handleSave}
        disabled={!selectedRange}
      >
        Save Age Range
      </Button>
      
      {onComplete && (
        <Button 
          variant="ghost" 
          className="w-full" 
          onClick={onComplete}
        >
          Skip for now
        </Button>
      )}
    </div>
  );
};

export default AgeRangeSelector;
