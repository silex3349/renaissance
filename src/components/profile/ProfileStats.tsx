
import React from 'react';
import { Users, Calendar, FileText } from 'lucide-react';

interface ProfileStatsProps {
  followers: number;
  following: number;
  posts: number;
  events: number;
}

const ProfileStats = ({ followers, following, posts, events }: ProfileStatsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3">
      <div className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="flex items-center gap-1 text-muted-foreground mb-1">
          <Users className="h-4 w-4" />
          <span className="text-xs font-medium">Followers</span>
        </div>
        <p className="text-lg font-bold">{followers}</p>
      </div>
      
      <div className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="flex items-center gap-1 text-muted-foreground mb-1">
          <Users className="h-4 w-4" />
          <span className="text-xs font-medium">Following</span>
        </div>
        <p className="text-lg font-bold">{following}</p>
      </div>
      
      <div className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="flex items-center gap-1 text-muted-foreground mb-1">
          <FileText className="h-4 w-4" />
          <span className="text-xs font-medium">Posts</span>
        </div>
        <p className="text-lg font-bold">{posts}</p>
      </div>
      
      <div className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="flex items-center gap-1 text-muted-foreground mb-1">
          <Calendar className="h-4 w-4" />
          <span className="text-xs font-medium">Events</span>
        </div>
        <p className="text-lg font-bold">{events}</p>
      </div>
    </div>
  );
};

export default ProfileStats;
