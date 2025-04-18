
import { calculateEventFee } from "./walletOperations";

type UserCategory = 'new' | 'active' | 'hibernating' | 'inactive';

// Fallback calculation when database function isn't available
export const calculateLocalEventFee = (baseAmount: number, userCategory: UserCategory): number => {
  // Apply discounts based on user category
  const discounts: Record<UserCategory, number> = {
    'active': 0.2, // 20% discount for active users
    'hibernating': 0.1, // 10% discount for hibernating users
    'new': 0, // No discount for new users
    'inactive': 0 // No discount for inactive users
  };

  const discount = discounts[userCategory] || 0;
  return Math.max(0, Math.round(baseAmount * (1 - discount)));
};

// Use the server function with local fallback
export const getEventFee = async (baseAmount: number, userId: string, userCategory: UserCategory): Promise<number> => {
  try {
    // Try to use the server function first
    const serverFee = await calculateEventFee(baseAmount, userId);
    return serverFee;
  } catch (error) {
    // Fall back to local calculation if server function fails
    console.warn("Using local fee calculation due to server error:", error);
    return calculateLocalEventFee(baseAmount, userCategory);
  }
};

// Base fees for different actions
export const FEE_CONSTANTS = {
  EVENT_CREATION: 50,
  EVENT_JOIN_STANDARD: 25,
  EVENT_JOIN_PREMIUM: 100,
  GROUP_CREATION: 75,
  GROUP_JOIN: 30
};
