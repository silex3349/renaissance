
export interface User {
  id: string;
  email: string;
  name?: string;
  bio?: string;
  profileImageUrl?: string;
  avatar?: string;
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
  settings?: {
    notifications: boolean;
    privacy: string;
  };
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
  pendingRequests?: string[]; // For exclusive events
  isExclusive?: boolean; // For exclusive events
  interests: Interest[];
  maxAttendees?: number;
  createdAt: Date;
  organizer?: string;
  groupId?: string;
  fee?: number; // Fee for joining the event
  creationFee?: number; // Fee for creating the event
}

export interface Interest {
  id: string;
  name: string;
  category: string;
  description?: string;
  imageUrl?: string;
  icon?: string; // Add icon property for interests
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
  location?: {
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
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

// Add Transaction interface
export interface Transaction {
  id: string;
  userId: string;
  type: "deposit" | "withdrawal" | "event_creation_fee" | "event_join_fee";
  amount: number;
  description: string;
  timestamp: Date;
  status: "pending" | "completed" | "failed";
  relatedItemId?: string;
}

// Updated Notification interface with payment-related types
export interface Notification {
  id: string;
  type: "groupInvite" | "eventReminder" | "newMessage" | "joinRequest" | "joinRequestApproved" | "joinRequestRejected" | "joinedGroup" | "systemNotification" | "paymentCompleted" | "paymentFailed" | "walletUpdated";
  message: string;
  actionUrl?: string;
  timestamp: Date;
  read: boolean;
  userId?: string;
  avatar?: string;
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
