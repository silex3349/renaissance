
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const handleInputChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) return;
    
    if (type === 'min') {
      if (numValue >= 18 && numValue < max) {
        setMin(numValue);
        onChange({ min: numValue, max });
      }
    } else if (type === 'max') {
      if (numValue <= 80 && numValue > min) {
        setMax(numValue);
        onChange({ min, max: numValue });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div className="space-y-1 w-20">
          <Label htmlFor="minAge">Min Age</Label>
          <Input 
            id="minAge"
            type="number" 
            min={18}
            max={max - 1}
            value={min}
            onChange={(e) => handleInputChange('min', e.target.value)}
            className="h-9"
          />
        </div>

        <div className="text-sm font-medium text-muted-foreground pb-2">
          to
        </div>
        
        <div className="space-y-1 w-20">
          <Label htmlFor="maxAge">Max Age</Label>
          <Input 
            id="maxAge"
            type="number" 
            min={min + 1}
            max={80}
            value={max}
            onChange={(e) => handleInputChange('max', e.target.value)}
            className="h-9"
          />
        </div>
      </div>
      
      <div className="space-y-6 pt-2">
        <div className="space-y-2">
          <Label>Minimum Age: {min}</Label>
          <Slider
            value={[min]}
            min={18}
            max={79}
            step={1}
            onValueChange={handleMinChange}
            className="py-1"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Maximum Age: {max}</Label>
          <Slider
            value={[max]}
            min={min + 1}
            max={80}
            step={1}
            onValueChange={handleMaxChange}
            className="py-1"
          />
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
