
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface EventBasicInfoProps {
  title: string;
  description: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const EventBasicInfo = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: EventBasicInfoProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Event Title</label>
            <Input 
              id="title" 
              value={title} 
              onChange={onTitleChange} 
              placeholder="Enter event title"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={onDescriptionChange} 
              placeholder="Describe your event"
              rows={4}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventBasicInfo;
