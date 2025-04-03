
import { Event, Interest, User } from "@/types";

export const INTERESTS: Interest[] = [
  { id: "1", name: "Hiking", category: "Outdoors", icon: "mountain" },
  { id: "2", name: "Reading", category: "Hobbies", icon: "book" },
  { id: "3", name: "Cooking", category: "Food", icon: "utensils" },
  { id: "4", name: "Photography", category: "Arts", icon: "camera" },
  { id: "5", name: "Yoga", category: "Fitness", icon: "lotus" },
  { id: "6", name: "Painting", category: "Arts", icon: "palette" },
  { id: "7", name: "Coding", category: "Technology", icon: "code" },
  { id: "8", name: "Board Games", category: "Games", icon: "chess-board" },
  { id: "9", name: "Dancing", category: "Performing Arts", icon: "music" },
  { id: "10", name: "Cycling", category: "Outdoors", icon: "bicycle" },
  { id: "11", name: "Music", category: "Arts", icon: "headphones" },
  { id: "12", name: "Gardening", category: "Outdoors", icon: "leaf" },
  { id: "13", name: "Movies", category: "Entertainment", icon: "film" },
  { id: "14", name: "Writing", category: "Arts", icon: "pen" },
  { id: "15", name: "Coffee", category: "Food", icon: "coffee" },
  { id: "16", name: "Tennis", category: "Sports", icon: "tennis-ball" },
  { id: "17", name: "Traveling", category: "Lifestyle", icon: "globe" },
  { id: "18", name: "Meditation", category: "Wellness", icon: "peace" },
  { id: "19", name: "Wildlife", category: "Nature", icon: "paw" },
  { id: "20", name: "History", category: "Education", icon: "book-open" },
];

export const INTEREST_CATEGORIES = Array.from(
  new Set(INTERESTS.map((interest) => interest.category))
);

export const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Morning Hike at Sunset Trail",
    description: "Join us for a refreshing morning hike along the scenic Sunset Trail. Perfect for all skill levels!",
    interests: [INTERESTS[0], INTERESTS[18]],
    location: { latitude: 37.7749, longitude: -122.4194, city: "San Francisco", country: "USA" },
    address: "Sunset Trail, Golden Gate Park, San Francisco",
    dateTime: new Date(new Date().setDate(new Date().getDate() + 2)),
    organizer: "user123",
    attendees: ["user123", "user456"],
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306",
    maxAttendees: 15
  },
  {
    id: "2",
    title: "Book Club: Modern Fiction",
    description: "Monthly book club discussion focusing on modern fiction. This month we're reading 'The Midnight Library'.",
    interests: [INTERESTS[1]],
    location: { latitude: 37.7833, longitude: -122.4167, city: "San Francisco", country: "USA" },
    address: "Green Apple Books, 506 Clement St, San Francisco",
    dateTime: new Date(new Date().setDate(new Date().getDate() + 5)),
    organizer: "user789",
    attendees: ["user789", "user012", "user345"],
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
    maxAttendees: 12
  },
  {
    id: "3",
    title: "Photography Walk: Urban Architecture",
    description: "Explore the city's stunning architecture through your lens. All photography levels welcome!",
    interests: [INTERESTS[3], INTERESTS[16]],
    location: { latitude: 37.7883, longitude: -122.4008, city: "San Francisco", country: "USA" },
    address: "Ferry Building, San Francisco",
    dateTime: new Date(new Date().setDate(new Date().getDate() + 3)),
    organizer: "user456",
    attendees: ["user456", "user678"],
    imageUrl: "https://images.unsplash.com/photo-1542259009477-d625272157b7",
    maxAttendees: 10
  },
  {
    id: "4",
    title: "Yoga in the Park",
    description: "Outdoor yoga session suitable for beginners. Bring your own mat and enjoy connecting with nature.",
    interests: [INTERESTS[4], INTERESTS[17]],
    location: { latitude: 37.7694, longitude: -122.4862, city: "San Francisco", country: "USA" },
    address: "Golden Gate Park, San Francisco",
    dateTime: new Date(new Date().setHours(new Date().getHours() + 26)),
    organizer: "user678",
    attendees: ["user678", "user901"],
    imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
    maxAttendees: 20
  },
  {
    id: "5",
    title: "Board Game Night",
    description: "Fun evening of strategic board games. Games provided, but feel free to bring your favorites!",
    interests: [INTERESTS[7]],
    location: { latitude: 37.7790, longitude: -122.4103, city: "San Francisco", country: "USA" },
    address: "The Game Parlour, 1342 Irving St, San Francisco",
    dateTime: new Date(new Date().setDate(new Date().getDate() + 4)),
    organizer: "user123",
    attendees: ["user123", "user456", "user789"],
    imageUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09",
    maxAttendees: 12
  }
];

export const MOCK_USERS: User[] = [
  {
    id: "user123",
    email: "user1@example.com",
    interests: [INTERESTS[0], INTERESTS[9], INTERESTS[16]],
    ageRange: "25-34",
    location: { latitude: 37.7749, longitude: -122.4194, city: "San Francisco", country: "USA" },
    joinedEvents: ["1", "5"],
    matchedUsers: ["user456", "user789"],
    createdAt: new Date(new Date().setMonth(new Date().getMonth() - 3))
  },
  {
    id: "user456",
    email: "user2@example.com",
    interests: [INTERESTS[0], INTERESTS[3], INTERESTS[7]],
    ageRange: "35-44",
    location: { latitude: 37.7833, longitude: -122.4167, city: "San Francisco", country: "USA" },
    joinedEvents: ["1", "3", "5"],
    matchedUsers: ["user123"],
    createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2))
  }
];
