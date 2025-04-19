
import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lock, Users } from "lucide-react";
import InterestSelector from "@/components/profile/InterestSelector";

interface EventSettingsProps {
  maxAttendees: string;
  isExclusive: boolean;
  onMaxAttendeesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExclusiveChange: (checked: boolean) => void;
}

const EventSettings = ({
  maxAttendees,
  isExclusive,
  onMaxAttendeesChange,
  onExclusiveChange,
}: EventSettingsProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Interests</label>
            <InterestSelector />
          </div>
          
          <div>
            <label htmlFor="maxAttendees" className="block text-sm font-medium mb-1 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Maximum Attendees
            </label>
            <Input 
              id="maxAttendees" 
              type="number" 
              min="1"
              value={maxAttendees} 
              onChange={onMaxAttendeesChange} 
              placeholder="Leave empty for unlimited"
            />
          </div>
          
          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <Switch
              id="isExclusive"
              checked={isExclusive}
              onCheckedChange={onExclusiveChange}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="isExclusive" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Exclusive Event
              </Label>
              <p className="text-sm text-muted-foreground">
                Attendees will need your approval to join this event
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventSettings;
