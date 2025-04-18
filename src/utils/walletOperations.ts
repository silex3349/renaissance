
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Transaction } from "@/types";

export const updateCoins = async (
  userId: string,
  amount: number, 
  transactionType: string, 
  description: string, 
  details?: any
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('update_user_coins', {
      user_uuid: userId,
      amount,
      transaction_type: transactionType,
      details_json: details || null,
      transaction_description: description
    });

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error(`Error updating coins:`, error);
    toast.error("Failed to process transaction");
    return false;
  }
};

export const fetchWalletData = async (userId: string): Promise<{
  balance: number;
  transactions: Transaction[];
} | null> => {
  try {
    const [profileResult, transactionsResult] = await Promise.all([
      supabase.rpc('get_user_profile', { user_uuid: userId }),
      supabase.rpc('get_user_transactions', { user_uuid: userId })
    ]);

    if (profileResult.error) throw profileResult.error;
    if (transactionsResult.error) throw transactionsResult.error;

    const formattedTransactions: Transaction[] = (transactionsResult.data || []).map((tx: any) => ({
      id: tx.id,
      type: tx.transaction_type,
      amount: tx.amount,
      description: tx.description || '',
      timestamp: new Date(tx.timestamp),
      status: 'completed',
      relatedItemId: tx.details?.itemId
    }));

    return {
      balance: profileResult.data?.coins || 0,
      transactions: formattedTransactions
    };
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    toast.error("Failed to load wallet data");
    return null;
  }
};
