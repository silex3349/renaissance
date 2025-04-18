
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Transaction } from "@/types";

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  depositFunds: (amount: number) => Promise<boolean>;
  withdrawFunds: (amount: number) => Promise<boolean>;
  chargeEventCreationFee: (eventId: string, amount: number) => Promise<boolean>;
  chargeEventJoinFee: (eventId: string, amount: number) => Promise<boolean>;
  refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshWallet = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch user's profile for current balance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('coins')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setBalance(profile?.coins || 0);

      // Fetch transaction history
      const { data: transactionData, error: transactionError } = await supabase
        .from('coin_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (transactionError) throw transactionError;

      const formattedTransactions: Transaction[] = (transactionData || []).map(tx => ({
        id: tx.id,
        type: tx.transaction_type,
        amount: tx.amount,
        description: tx.description || '',
        timestamp: new Date(tx.timestamp),
        status: 'completed',
        relatedItemId: tx.details?.itemId
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("Failed to load wallet data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshWallet();
    } else {
      setBalance(0);
      setTransactions([]);
      setIsLoading(false);
    }
  }, [user]);

  const updateCoins = async (
    amount: number, 
    transactionType: string, 
    description: string, 
    details?: any
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('update_user_coins', {
        user_uuid: user.id,
        amount,
        transaction_type: transactionType,
        details_json: details || null,
        transaction_description: description
      });

      if (error) throw error;

      if (data) {
        await refreshWallet();
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error updating coins:`, error);
      toast.error("Failed to process transaction");
      return false;
    }
  };

  const depositFunds = async (amount: number): Promise<boolean> => {
    if (!user || amount <= 0) {
      toast.error("Invalid deposit amount");
      return false;
    }

    const success = await updateCoins(
      amount,
      'deposit',
      'Added funds to wallet'
    );

    if (success) {
      toast.success(`Successfully added 🪙${amount} to your wallet`);
    }
    return success;
  };

  const withdrawFunds = async (amount: number): Promise<boolean> => {
    if (!user || amount <= 0) {
      toast.error("Invalid withdrawal amount");
      return false;
    }

    if (amount > balance) {
      toast.error("Insufficient funds");
      return false;
    }

    const success = await updateCoins(
      -amount,
      'withdrawal',
      'Withdrew funds from wallet'
    );

    if (success) {
      toast.success(`Successfully withdrew 🪙${amount} from your wallet`);
    }
    return success;
  };

  const chargeEventCreationFee = async (eventId: string, amount: number): Promise<boolean> => {
    if (!user || amount <= 0) return true;
    if (amount > balance) {
      toast.error("Insufficient funds to create event");
      return false;
    }

    const success = await updateCoins(
      -amount,
      'event_creation_fee',
      'Event creation fee',
      { eventId }
    );

    if (success) {
      toast.success(`Event creation fee of 🪙${amount} charged successfully`);
    }
    return success;
  };

  const chargeEventJoinFee = async (eventId: string, amount: number): Promise<boolean> => {
    if (!user || amount <= 0) return true;
    if (amount > balance) {
      toast.error("Insufficient funds to join event");
      return false;
    }

    const success = await updateCoins(
      -amount,
      'event_join_fee',
      'Event join fee',
      { eventId }
    );

    if (success) {
      toast.success(`Event join fee of 🪙${amount} charged successfully`);
    }
    return success;
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        depositFunds,
        withdrawFunds,
        chargeEventCreationFee,
        chargeEventJoinFee,
        refreshWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
