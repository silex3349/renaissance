

export interface Interest {
  id: string;
  name: string;
  category: string;  // Changed from optional to required
  icon?: string;
}

export interface Event {
  id: string;
  title: string;
  name: string;
  description: string;
  location: {
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  address?: string;
  dateTime: Date;
  startTime: Date;
  endTime: Date;
  groupId?: string;
  creator: string;
  attendees: string[];
  interests: Interest[];
  createdAt: Date;
  imageUrl?: string;
  maxAttendees?: number;
  organizer?: string;
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
  location?: {
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  events?: string[];
}

export interface User {
  id: string;
  email: string;
  password?: string;
  interests?: Interest[];
  joinedAt?: Date;
  createdAt?: Date;
  location?: {
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
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

