
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface AgeRangeSelectorProps {
  initialAgeRange?: { min: number; max: number };
  onChange: (ageRange: { min: number; max: number }) => void;
}

const AgeRangeSelector = ({ initialAgeRange, onChange }: AgeRangeSelectorProps) => {
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
    <div className="space-y-6">
      <div className="space-y-2">
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
    </div>
  );
};

export default AgeRangeSelector;
