
export interface Interest {
  id: string;
  name: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  groupId?: string;
  creator: string;
  attendees: string[];
  interests: Interest[];
  createdAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  creator: string;
  members: string[];
  interests: Interest[];
  isPrivate: boolean;
  createdAt: Date;
  location?: string;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  interests?: Interest[];
  joinedAt?: Date;
  location?: {
    city: string;
    country: string;
  };
  ageRange?: {
    min: number;
    max: number;
  };
  name?: string;
  avatar?: string;
  bio?: string;
  joinedEvents?: string[];
  matchedUsers?: string[];
  joinedGroups?: string[];
}

export interface Notification {
  id: string;
  type: 'groupInvite' | 'eventReminder' | 'newMessage' | 'joinRequest' | 'joinedGroup' | 'other';
  message: string;
  actionUrl?: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
}
