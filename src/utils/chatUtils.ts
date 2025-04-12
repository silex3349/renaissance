
/**
 * Format a timestamp for chat messages
 */
export const formatMessageTime = (date: Date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const messageDate = new Date(date);
  const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
  
  // Today
  if (messageDay.getTime() === today.getTime()) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Yesterday
  if (messageDay.getTime() === yesterday.getTime()) {
    return `Yesterday, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Within the last week
  const daysDiff = Math.floor((today.getTime() - messageDay.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff < 7) {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    return messageDate.toLocaleDateString(undefined, options);
  }
  
  // More than a week ago
  return messageDate.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: today.getFullYear() !== messageDate.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Create a unique chat ID for two users
 */
export const createDirectChatId = (userId1: string, userId2: string) => {
  // Sort the IDs to ensure the same chat ID regardless of order
  const sortedIds = [userId1, userId2].sort();
  return `chat_${sortedIds[0]}_${sortedIds[1]}`;
};

/**
 * Truncate text with ellipsis if it exceeds maxLength
 */
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get initials from a name
 */
export const getInitials = (name: string) => {
  if (!name) return '';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Generate a placeholder avatar color based on a string
 */
export const getAvatarColor = (str: string) => {
  const colors = [
    '#F97316', // Orange
    '#84CC16', // Lime
    '#06B6D4', // Cyan
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#F43F5E', // Rose
    '#0EA5E9', // Sky
    '#10B981', // Emerald
  ];
  
  // Generate a simple hash from the string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use the hash to pick a color
  return colors[Math.abs(hash) % colors.length];
};
