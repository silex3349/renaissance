
export type User = {
  id: string;
  email: string;
  interests: Interest[];
  ageRange?: string;
  location?: GeoLocation;
  joinedEvents: string[];
  matchedUsers: string[];
  createdAt: Date;
};

export type Interest = {
  id: string;
  name: string;
  icon?: string;
  category: string;
};

export type GeoLocation = {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  interests: Interest[];
  location: GeoLocation;
  address: string;
  dateTime: Date;
  organizer: string;
  attendees: string[];
  imageUrl?: string;
  maxAttendees?: number;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  interests: Interest[];
  members: string[];
  events: string[];
  isPrivate: boolean;
  createdAt: Date;
  creator: string;
};

export type Match = {
  id: string;
  users: [string, string];
  commonInterests: string[];
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
};
