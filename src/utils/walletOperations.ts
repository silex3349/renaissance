
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { TransactionType, WalletTransaction, TransactionResult, WalletUpdateParams } from "@/types/wallet";

export const updateCoins = async ({
  userId,
  amount,
  transactionType,
  description,
  details
}: WalletUpdateParams): Promise<TransactionResult> => {
  try {
    const { data, error } = await supabase.rpc('update_user_coins', {
      user_uuid: userId,
      amount,
      transaction_type: transactionType,
      transaction_description: description,
      details_json: details || null
    });

    if (error) {
      console.error("Error calling update_user_coins:", error);
      throw error;
    }

    if (!data.success) {
      return {
        success: false,
        error: data.error || "Transaction failed"
      };
    }

    return {
      success: true,
      transaction: {
        id: data.transaction.id,
        type: data.transaction.type as TransactionType,
        amount: data.transaction.amount,
        description: data.transaction.description || "",
        timestamp: new Date(data.transaction.timestamp),
        status: "completed",
        details: data.transaction.details
      },
      newBalance: data.new_balance
    };
  } catch (error) {
    console.error(`Error updating coins:`, error);
    toast.error("Failed to process transaction");
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};

export const fetchWalletData = async (userId: string): Promise<{
  balance: number;
  transactions: WalletTransaction[];
} | null> => {
  try {
    const [profileResult, transactionsResult] = await Promise.all([
      supabase.rpc('get_user_profile', { user_uuid: userId }),
      supabase.rpc('get_user_transactions', { user_uuid: userId })
    ]);

    if (profileResult.error) {
      console.error("Error fetching profile:", profileResult.error);
      throw profileResult.error;
    }
    
    if (transactionsResult.error) {
      console.error("Error fetching transactions:", transactionsResult.error);
      throw transactionsResult.error;
    }

    const formattedTransactions: WalletTransaction[] = (transactionsResult.data || []).map((tx: any) => ({
      id: tx.id,
      type: tx.transaction_type as TransactionType,
      amount: tx.amount,
      description: tx.description || '',
      timestamp: new Date(tx.timestamp),
      status: 'completed',
      relatedItemId: tx.details?.itemId,
      details: tx.details
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

export const calculateEventFee = async (
  baseAmount: number, 
  userId: string
): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc('calculate_event_fee', {
      base_amount: baseAmount,
      user_uuid: userId
    });

    if (error) {
      console.error("Error calculating event fee:", error);
      return baseAmount; // Fall back to base amount if calculation fails
    }

    return data || baseAmount;
  } catch (error) {
    console.error("Error calculating event fee:", error);
    return baseAmount; // Fall back to base amount if calculation fails
  }
};

export const updateUserStats = async (
  userId: string,
  statType: 'events_created' | 'events_joined' | 'groups_created' | 'groups_joined'
): Promise<boolean> => {
  try {
    // First try to update the existing record
    const { error } = await supabase
      .from('user_stats')
      .update({ 
        [statType]: supabase.rpc('increment', { value: 1 }),
        last_activity: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      // If update fails, try to insert a new record
      const { error: insertError } = await supabase
        .from('user_stats')
        .insert({
          user_id: userId,
          [statType]: 1,
          last_activity: new Date().toISOString()
        });

      if (insertError) {
        console.error("Error updating user stats:", insertError);
        return false;
      }
    }
    
    // Recalculate user category after stat update
    await supabase.rpc('recalculate_user_category', { user_uuid: userId });
    
    return true;
  } catch (error) {
    console.error("Error updating user stats:", error);
    return false;
  }
};
