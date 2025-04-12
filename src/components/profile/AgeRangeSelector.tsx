
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AgeRangeSelectorProps {
  initialAgeRange?: { min: number; max: number };
  onChange: (ageRange: { min: number; max: number }) => void;
  onComplete?: () => void;
}

const AgeRangeSelector = ({ initialAgeRange, onChange, onComplete }: AgeRangeSelectorProps) => {
  const [min, setMin] = useState(initialAgeRange?.min || 18);
  const [max, setMax] = useState(initialAgeRange?.max || 65);
  
  const handleMinChange = (value: number[]) => {
    const newMin = Math.min(value[0], max - 1);
    setMin(newMin);
    onChange({ min: newMin, max });
  };
  
  const handleMaxChange = (value: number[]) => {
    const newMax = Math.max(value[0], min + 1);
    setMax(newMax);
    onChange({ min, max: newMax });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium mb-1">Select Age Range</h3>
        <p className="text-sm text-muted-foreground">
          Choose the age range you're interested in connecting with
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <Label>Minimum Age: {min}</Label>
          <Label>Maximum Age: {max}</Label>
        </div>
        
        <div className="space-y-8">
          <div className="space-y-2">
            <Slider
              value={[min]}
              min={18}
              max={80}
              step={1}
              onValueChange={handleMinChange}
            />
          </div>
          
          <div className="space-y-2">
            <Slider
              value={[max]}
              min={19}
              max={80}
              step={1}
              onValueChange={handleMaxChange}
            />
          </div>
        </div>
      </div>
      
      {onComplete && (
        <Button onClick={onComplete} className="w-full mt-4">
          Continue
        </Button>
      )}
    </div>
  );
};

export default AgeRangeSelector;
