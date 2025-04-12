import { User, Interest, GeoLocation, Event, Group } from "@/types";

export const INTERESTS: Interest[] = [
  {
    id: "photography",
    name: "Photography",
    icon: "camera",
    category: "Arts",
  },
  {
    id: "travel",
    name: "Travel",
    icon: "plane",
    category: "Adventure",
  },
  {
    id: "hiking",
    name: "Hiking",
    icon: "mountain",
    category: "Outdoors",
  },
  {
    id: "nature",
    name: "Nature",
    icon: "tree",
    category: "Outdoors",
  },
  {
    id: "technology",
    name: "Technology",
    icon: "code",
    category: "Professional",
  },
  {
    id: "programming",
    name: "Programming",
    icon: "laptop",
    category: "Education",
  },
  {
    id: "cooking",
    name: "Cooking",
    icon: "utensils",
    category: "Food",
  },
  {
    id: "food",
    name: "Dining Out",
    icon: "restaurant",
    category: "Food",
  },
  {
    id: "music",
    name: "Music",
    icon: "music",
    category: "Arts",
  },
  {
    id: "movies",
    name: "Movies",
    icon: "film",
    category: "Arts",
  },
  {
    id: "reading",
    name: "Reading",
    icon: "book",
    category: "Education",
  },
  {
    id: "writing",
    name: "Writing",
    icon: "edit",
    category: "Arts",
  },
  {
    id: "sports",
    name: "Sports",
    icon: "football",
    category: "Fitness",
  },
  {
    id: "fitness",
    name: "Fitness",
    icon: "heart",
    category: "Fitness",
  },
  {
    id: "yoga",
    name: "Yoga",
    icon: "sun",
    category: "Fitness",
  },
  {
    id: "meditation",
    name: "Meditation",
    icon: "cloud",
    category: "Wellness",
  },
  {
    id: "art",
    name: "Art",
    icon: "paint-brush",
    category: "Arts",
  },
  {
    id: "dance",
    name: "Dance",
    icon: "move",
    category: "Arts",
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "shopping-bag",
    category: "Lifestyle",
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: "gamepad",
    category: "Entertainment",
  },
];

export const INTEREST_CATEGORIES: string[] = [
  "Arts",
  "Adventure",
  "Outdoors",
  "Professional",
  "Education",
  "Food",
  "Fitness",
  "Wellness",
  "Lifestyle",
  "Entertainment"
];

export const MOCK_USERS: User[] = [
  {
    id: "user_1",
    email: "alex@example.com",
    interests: [INTERESTS[0], INTERESTS[1], INTERESTS[2]],
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      city: "San Francisco",
      country: "USA",
    },
    joinedEvents: ["event_1", "event_3", "event_4"],
    matchedUsers: ["user_2", "user_3"],
    createdAt: new Date("2022-01-01"),
  },
  {
    id: "user_2",
    email: "bob@example.com",
    interests: [INTERESTS[2], INTERESTS[3], INTERESTS[4]],
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
      city: "Los Angeles",
      country: "USA",
    },
    joinedEvents: ["event_2", "event_5"],
    matchedUsers: ["user_1", "user_4"],
    createdAt: new Date("2022-02-15"),
  },
  {
    id: "user_3",
    email: "charlie@example.com",
    interests: [INTERESTS[5], INTERESTS[6], INTERESTS[7]],
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      city: "New York",
      country: "USA",
    },
    joinedEvents: ["event_1", "event_6"],
    matchedUsers: ["user_1", "user_5"],
    createdAt: new Date("2022-03-20"),
  },
  {
    id: "user_4",
    email: "david@example.com",
    interests: [INTERESTS[8], INTERESTS[9], INTERESTS[10]],
    location: {
      latitude: 51.5074,
      longitude: 0.1278,
      city: "London",
      country: "UK",
    },
    joinedEvents: ["event_2", "event_7"],
    matchedUsers: ["user_2", "user_6"],
    createdAt: new Date("2022-04-10"),
  },
  {
    id: "user_5",
    email: "eve@example.com",
    interests: [INTERESTS[11], INTERESTS[12], INTERESTS[13]],
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      city: "Paris",
      country: "France",
    },
    joinedEvents: ["event_3", "event_8"],
    matchedUsers: ["user_3", "user_7"],
    createdAt: new Date("2022-05-01"),
  },
  {
    id: "user_6",
    email: "frank@example.com",
    interests: [INTERESTS[14], INTERESTS[15], INTERESTS[16]],
    location: {
      latitude: 35.6895,
      longitude: 139.6917,
      city: "Tokyo",
      country: "Japan",
    },
    joinedEvents: ["event_4", "event_9"],
    matchedUsers: ["user_4", "user_8"],
    createdAt: new Date("2022-06-05"),
  },
  {
    id: "user_7",
    email: "grace@example.com",
    interests: [INTERESTS[17], INTERESTS[18], INTERESTS[19]],
    location: {
      latitude: -33.8688,
      longitude: 151.2093,
      city: "Sydney",
      country: "Australia",
    },
    joinedEvents: ["event_5", "event_10"],
    matchedUsers: ["user_5", "user_9"],
    createdAt: new Date("2022-07-12"),
  },
  {
    id: "user_8",
    email: "harry@example.com",
    interests: [INTERESTS[0], INTERESTS[5], INTERESTS[10]],
    location: {
      latitude: 31.2304,
      longitude: 121.4737,
      city: "Shanghai",
      country: "China",
    },
    joinedEvents: ["event_6"],
    matchedUsers: ["user_6", "user_10"],
    createdAt: new Date("2022-08-18"),
  },
  {
    id: "user_9",
    email: "ivy@example.com",
    interests: [INTERESTS[1], INTERESTS[6], INTERESTS[11]],
    location: {
      latitude: 19.076,
      longitude: 72.8777,
      city: "Mumbai",
      country: "India",
    },
    joinedEvents: ["event_7"],
    matchedUsers: ["user_7"],
    createdAt: new Date("2022-09-22"),
  },
  {
    id: "user_10",
    email: "jack@example.com",
    interests: [INTERESTS[2], INTERESTS[7], INTERESTS[12]],
    location: {
      latitude: 55.7558,
      longitude: 37.6173,
      city: "Moscow",
      country: "Russia",
    },
    joinedEvents: ["event_8"],
    matchedUsers: ["user_8"],
    createdAt: new Date("2022-10-01"),
  },
];

export const MOCK_GROUPS = [
  {
    id: "group_1",
    name: "Photography Enthusiasts",
    description: "A group for photography lovers to share tips, organize photoshoots, and explore beautiful locations together.",
    interests: [
      {
        id: "photography",
        name: "Photography",
        category: "Arts"
      },
      {
        id: "travel",
        name: "Travel",
        category: "Adventure"
      }
    ],
    members: ["user_1", "user_2", "user_3"],
    events: ["event_1", "event_3"],
    isPrivate: false,
    createdAt: new Date("2023-01-15"),
    creator: "user_1"
  },
  {
    id: "group_2",
    name: "Hiking Adventures",
    description: "Join us for exciting hiking trips around the city and beyond. All skill levels welcome!",
    interests: [
      {
        id: "hiking",
        name: "Hiking",
        category: "Outdoors"
      },
      {
        id: "nature",
        name: "Nature",
        category: "Outdoors"
      }
    ],
    members: ["user_2", "user_4"],
    events: ["event_2"],
    isPrivate: false,
    createdAt: new Date("2023-02-20"),
    creator: "user_2"
  },
  {
    id: "group_3",
    name: "Tech Innovators",
    description: "A private group for tech professionals and enthusiasts to discuss emerging technologies and collaborate on projects.",
    interests: [
      {
        id: "technology",
        name: "Technology",
        category: "Professional"
      },
      {
        id: "programming",
        name: "Programming",
        category: "Education"
      }
    ],
    members: ["user_1", "user_5"],
    events: ["event_4"],
    isPrivate: true,
    createdAt: new Date("2023-03-10"),
    creator: "user_5"
  },
  {
    id: "group_4",
    name: "Culinary Explorers",
    description: "Discover new restaurants, share recipes, and organize cooking sessions with fellow food lovers.",
    interests: [
      {
        id: "cooking",
        name: "Cooking",
        category: "Food"
      },
      {
        id: "food",
        name: "Dining Out",
        category: "Food"
      }
    ],
    members: ["user_3", "user_4", "user_5"],
    events: [],
    isPrivate: false,
    createdAt: new Date("2023-04-05"),
    creator: "user_3"
  }
];

export const MOCK_EVENTS = [
  {
    id: "event_1",
    title: "Urban Photography Walk",
    description: "Join us for a guided photography walk through the urban landscapes of downtown. Bring your camera and capture the city's hidden gems!",
    interests: [
      {
        id: "photography",
        name: "Photography",
        category: "Arts"
      }
    ],
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      city: "San Francisco",
      country: "USA"
    },
    address: "Union Square, San Francisco, CA",
    dateTime: new Date("2023-07-15T10:00:00"),
    organizer: "user_1",
    attendees: ["user_1", "user_2", "user_3"],
    imageUrl: "/placeholder.svg",
    maxAttendees: 20,
    groupId: "group_1"
  },
  {
    id: "event_2",
    title: "Mountain Trail Hike",
    description: "A moderate 5-mile hike with beautiful views. Perfect for beginners and intermediate hikers alike.",
    interests: [
      {
        id: "hiking",
        name: "Hiking",
        category: "Outdoors"
      }
    ],
    location: {
      latitude: 37.8199,
      longitude: -122.4783,
      city: "San Francisco",
      country: "USA"
    },
    address: "Mount Tamalpais State Park",
    dateTime: new Date("2023-07-20T08:00:00"),
    organizer: "user_2",
    attendees: ["user_2", "user_4"],
    imageUrl: "/placeholder.svg",
    maxAttendees: 15,
    groupId: "group_2"
  },
  {
    id: "event_3",
    title: "Sunset Photography Session",
    description: "Capture the golden hour with fellow photographers at a scenic overlook.",
    interests: [
      {
        id: "photography",
        name: "Photography",
        category: "Arts"
      }
    ],
    location: {
      latitude: 37.7952,
      longitude: -122.4028,
      city: "San Francisco",
      country: "USA"
    },
    address: "Golden Gate Bridge Vista Point",
    dateTime: new Date("2023-07-22T19:00:00"),
    organizer: "user_1",
    attendees: ["user_1", "user_3"],
    imageUrl: "/placeholder.svg",
    maxAttendees: 10,
    groupId: "group_1"
  },
  {
    id: "event_4",
    title: "Tech Meetup: AI and the Future",
    description: "Discuss the latest trends in artificial intelligence and its impact on various industries.",
    interests: [
      {
        id: "technology",
        name: "Technology",
        category: "Professional"
      }
    ],
    location: {
      latitude: 37.7833,
      longitude: -122.4092,
      city: "San Francisco",
      country: "USA"
    },
    address: "Galvanize, San Francisco",
    dateTime: new Date("2023-07-25T18:30:00"),
    organizer: "user_5",
    attendees: ["user_1", "user_5"],
    imageUrl: "/placeholder.svg",
    maxAttendees: 30,
    groupId: "group_3"
  },
  {
    id: "event_5",
    title: "Beach Cleanup and Yoga",
    description: "Start your day with a beach cleanup followed by a relaxing yoga session.",
    interests: [
      {
        id: "yoga",
        name: "Yoga",
        category: "Fitness"
      }
    ],
    location: {
      latitude: 34.0083,
      longitude: -118.4983,
      city: "Los Angeles",
      country: "USA"
    },
    address: "Santa Monica Beach",
    dateTime: new Date("2023-07-28T09:00:00"),
    organizer: "user_2",
    attendees: ["user_2"],
    imageUrl: "/placeholder.svg",
    maxAttendees: 25
  },
  {
    id: "event_6",
    title: "Indie Film Screening",
    description: "Watch and discuss a selection of independent short films.",
    interests: [
      {
        id: "movies",
        name: "Movies",
        category: "Arts"
      }
    ],
    location: {
      latitude: 40.7306,
      longitude: -73.9866,
      city: "New York",
      country: "USA"
    },
    address: "Angelika Film Center, New York",
    dateTime: new Date("2023-07-30T20:00:00"),
    organizer: "user_3",
    attendees: ["user_3"],
    imageUrl: "/placeholder.svg",
    maxAttendees: 40
  },
  {
    id: "event_7",
    title: "Historical London Walking Tour",
    description: "Explore London's rich history with a guided walking tour.",
    interests: [
      {
        id: "travel",
        name: "Travel",
        category: "Adventure"
      }
    ],
    location: {
      latitude: 51.5074,
      longitude: 0.1278,
      city: "London",
      country: "UK"
    },
    address: "Tower of London",
    dateTime: new Date("2023-08-02T11:00:00"),
    organizer: "user_4",
    attendees: ["user_4"],
    imageUrl: "/placeholder.svg",
    maxAttendees: 15
  },
  {
    id: "event_8",
    title: "French Cooking Class",
    description: "Learn to prepare classic French dishes in a hands-on cooking class.",
    interests: [
      {
        id: "cooking",
        name: "Cooking",
        category: "Food"
      }
    ],
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      city: "Paris",
      country: "France"
    },
    address: "Le Cordon Bleu, Paris",
    dateTime: new Date("2023-08-05T14:00:00"),
    organizer: "user_5",
    attendees: ["user_5"],
    imageUrl: "/placeholder.svg",
    maxAttendees: 12
  },
  {
    id: "event_9",
    title: "Traditional Tea Ceremony",
    description: "Experience a traditional Japanese tea ceremony.",
    interests: [
      {
        id: "travel",
        name: "Travel",
        category: "Adventure"
      }
    ],
    location: {
      latitude: 35.6895,
      longitude: 139.6917,
      city: "Tokyo",
      country: "Japan"
    },
    address: "Imperial Palace East Garden",
    dateTime: new Date("2023-08-08T15:00:00"),
    organizer: "user_6",
    attendees: ["user_6"],
    imageUrl: "/placeholder.svg",
    maxAttendees: 8
  },
  {
    id: "event_10",
    title: "Sydney Harbour Cruise",
    description: "Enjoy a scenic cruise around Sydney Harbour.",
    interests: [
      {
        id: "travel",
        name: "Travel",
        category: "Adventure"
      }
    ],
    location: {
      latitude: -33.8688,
      longitude: 151.2093,
      city: "Sydney",
      country: "Australia"
    },
    address: "Circular Quay",
    dateTime: new Date("2023-08-11T10:30:00"),
    organizer: "user_7",
    attendees: ["user_7"],
    imageUrl: "/placeholder.svg",
    maxAttendees: 20
  },
];
