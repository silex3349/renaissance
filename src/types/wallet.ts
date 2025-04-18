
export type TransactionType = "deposit" | "withdrawal" | "event_creation_fee" | "event_join_fee" | "group_creation_fee" | "group_join_fee";

export type TransactionStatus = "pending" | "completed" | "failed";

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: Date;
  status: TransactionStatus;
  relatedItemId?: string;
  details?: Record<string, any>;
}

export interface TransactionResult {
  success: boolean;
  error?: string;
  transaction?: WalletTransaction;
  newBalance?: number;
}

export interface WalletUpdateParams {
  userId: string;
  amount: number;
  transactionType: TransactionType;
  description: string;
  details?: Record<string, any>;
}
