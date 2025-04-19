
import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import LocationDetection from "@/components/location/LocationDetection";

interface EventLocationProps {
  address: string;
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventLocation = ({ address, onAddressChange }: EventLocationProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </label>
            <LocationDetection />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
            <Input 
              id="address" 
              value={address} 
              onChange={onAddressChange} 
              placeholder="Enter specific address"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventLocation;
