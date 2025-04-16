
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProfileCompletionProps {
  completion: number;
}

const ProfileCompletion = ({ completion }: ProfileCompletionProps) => {
  const getMissingItem = () => {
    if (completion === 25) return "Add a bio, interests, and profile picture";
    if (completion === 50) return "Add interests and a profile picture";
    if (completion === 75) return "Add a profile picture";
    return "";
  };

  return (
    <div className="mt-4 w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-muted-foreground">Profile completion</span>
        <span className="text-xs font-medium">{completion}%</span>
      </div>
      <Progress value={completion} className="h-2" />
      {completion < 100 && (
        <p className="text-xs mt-1 text-muted-foreground">
          {getMissingItem()} to complete your profile
        </p>
      )}
    </div>
  );
};

export default ProfileCompletion;
