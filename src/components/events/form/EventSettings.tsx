
import React from "react";
import EventControlSettings from "./controls/EventControlSettings";
import EventInterests from "./interests/EventInterests";

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
    <div className="space-y-6">
      <EventInterests />
      <EventControlSettings
        maxAttendees={maxAttendees}
        isExclusive={isExclusive}
        onMaxAttendeesChange={onMaxAttendeesChange}
        onExclusiveChange={onExclusiveChange}
      />
    </div>
  );
};

export default EventSettings;
