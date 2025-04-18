
type UserCategory = 'new' | 'active' | 'hibernating' | 'inactive';

export const calculateEventFee = (baseAmount: number, userCategory: UserCategory): number => {
  // Apply discounts based on user category
  const discounts: Record<UserCategory, number> = {
    'active': 0.2, // 20% discount for active users
    'hibernating': 0.1, // 10% discount for hibernating users
    'new': 0, // No discount for new users
    'inactive': 0 // No discount for inactive users
  };

  const discount = discounts[userCategory] || 0;
  return baseAmount * (1 - discount);
};
