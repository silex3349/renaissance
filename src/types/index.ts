export interface User {
  id: string;
  email: string;
  name?: string;
  bio?: string;
  profileImageUrl?: string;
  interests: Interest[];
  joinedEvents: string[];
  matchedUsers: string[];
  joinedGroups: string[];
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
  createdAt: Date;
  watchlist?: any;
}

export interface Event {
  id: string;
  title: string;
  name: string;
  description: string;
  imageUrl?: string;
  dateTime: Date;
  startTime: Date;
  endTime: Date;
  location: {
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  address?: string;
  creator: string;
  attendees: string[];
  pendingRequests?: string[]; // New for exclusive events
  isExclusive?: boolean; // New for exclusive events
  interests: Interest[];
  maxAttendees?: number;
  createdAt: Date;
}

export interface Interest {
  id: string;
  name: string;
  category: string;
  description?: string;
  imageUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  interests: Interest[];
  members: string[];
  events: string[];
  isPrivate: boolean;
  createdAt: Date;
  creator: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date;
}

export interface GroupChatMessage {
  id: string;
  sender: string;
  groupId: string;
  content: string;
  timestamp: Date;
}

// Component Props
export interface GroupDetailProps {
  group: Group;
  members: User[];
  onAddToWatchlist?: (groupId: string) => void;
}

// EventDetail Props
export interface EventDetailProps {
  event: Event;
  attendees: User[];
}

export interface EventListProps {
  events: Event[];
  title?: string;
  showMap?: boolean;
  onToggleMap?: () => void;
}

export interface GroupListProps {
  groups: Group[];
  title?: string;
}
