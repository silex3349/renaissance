
import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface EventDateTimeProps {
  date: string;
  time: string;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventDateTime = ({
  date,
  time,
  onDateChange,
  onTimeChange,
}: EventDateTimeProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date
            </label>
            <Input 
              id="date" 
              type="date" 
              value={date} 
              onChange={onDateChange} 
              required
            />
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium mb-1 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time
            </label>
            <Input 
              id="time" 
              type="time" 
              value={time} 
              onChange={onTimeChange} 
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDateTime;
