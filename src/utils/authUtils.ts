
// Social authentication utility functions
import { User } from "@/types";

// Google authentication result type
interface GoogleAuthResponse {
  clientId: string;
  credential: string;
  select_by: string;
}

// Create user from Google credentials
export const createUserFromGoogle = (response: GoogleAuthResponse): Partial<User> => {
  // In a real application, you would decode the JWT token
  // For now, we'll create a simple user object
  return {
    id: `google_${Date.now()}`,
    email: `google_user_${Date.now()}@example.com`,
    name: "Google User",
    profileImageUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=google",
    interests: [],
    joinedEvents: [],
    matchedUsers: [],
    joinedGroups: [],
    settings: {
      notifications: true,
      privacy: "public",
    },
    createdAt: new Date()
  };
};

// Create user from Apple credentials
export const createUserFromApple = (response: any): Partial<User> => {
  // In a real application, you would use the data from Apple's response
  return {
    id: `apple_${Date.now()}`,
    email: `apple_user_${Date.now()}@example.com`,
    name: "Apple User",
    profileImageUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=apple",
    interests: [],
    joinedEvents: [],
    matchedUsers: [],
    joinedGroups: [],
    settings: {
      notifications: true,
      privacy: "public",
    },
    createdAt: new Date()
  };
};
