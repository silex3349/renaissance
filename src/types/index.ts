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
  location?: string; // Add location property
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
  name?: string;      // Add name property
  avatar?: string;    // Add avatar property
  bio?: string;       // Add bio property
}
