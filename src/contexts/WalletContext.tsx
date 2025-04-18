
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "event_creation_fee" | "event_join_fee";
  description: string;
  amount: number;
  timestamp: Date;
  status: "pending" | "completed" | "failed";
  relatedItemId?: string; // ID of related event, etc.
}

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

  // Load wallet data when user changes
  useEffect(() => {
    if (user) {
      refreshWallet();
    } else {
      setBalance(0);
      setTransactions([]);
      setIsLoading(false);
    }
  }, [user]);

  const refreshWallet = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // For now, we'll use mock data since we don't have the actual Supabase tables yet
      // In a real implementation, you would fetch from your wallet tables
      
      // Mock balance
      setBalance(500); // ₹500 starting balance
      
      // Mock transactions
      const mockTransactions: Transaction[] = [
        {
          id: "tx_1",
          type: "deposit",
          description: "Initial deposit",
          amount: 300,
          timestamp: new Date(Date.now() - 86400000 * 3), // 3 days ago
          status: "completed"
        },
        {
          id: "tx_2",
          type: "deposit",
          description: "Added funds",
          amount: 200,
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          status: "completed"
        },
        {
          id: "tx_3",
          type: "event_creation_fee",
          description: "Created 'Photography Workshop' event",
          amount: -50,
          timestamp: new Date(Date.now() - 3600000 * 5), // 5 hours ago
          status: "completed",
          relatedItemId: "event_1"
        },
        {
          id: "tx_4",
          type: "event_join_fee",
          description: "Joined 'Hiking Adventure' event",
          amount: -25,
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          status: "completed",
          relatedItemId: "event_2"
        }
      ];
      
      setTransactions(mockTransactions);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("Failed to load wallet data");
    } finally {
      setIsLoading(false);
    }
  };

  const depositFunds = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    if (amount <= 0) {
      toast.error("Amount must be greater than zero");
      return false;
    }
    
    setIsLoading(true);
    try {
      // In real implementation, integrate with payment gateway here
      // For now, we'll just simulate a successful deposit
      
      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: "deposit",
        description: "Added funds",
        amount: amount,
        timestamp: new Date(),
        status: "completed"
      };
      
      setBalance(prevBalance => prevBalance + amount);
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast.success(`Successfully added ₹${amount} to your wallet`);
      return true;
    } catch (error) {
      console.error("Error depositing funds:", error);
      toast.error("Failed to deposit funds");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawFunds = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    if (amount <= 0) {
      toast.error("Amount must be greater than zero");
      return false;
    }
    if (amount > balance) {
      toast.error("Insufficient funds");
      return false;
    }
    
    setIsLoading(true);
    try {
      // In real implementation, integrate with payment gateway here
      // For now, we'll just simulate a successful withdrawal
      
      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: "withdrawal",
        description: "Withdrew funds",
        amount: -amount,
        timestamp: new Date(),
        status: "completed"
      };
      
      setBalance(prevBalance => prevBalance - amount);
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast.success(`Successfully withdrew ₹${amount} from your wallet`);
      return true;
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast.error("Failed to withdraw funds");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const chargeEventCreationFee = async (eventId: string, amount: number): Promise<boolean> => {
    if (!user) return false;
    if (amount <= 0) return true; // No fee
    if (amount > balance) {
      toast.error("Insufficient funds to create event");
      return false;
    }
    
    setIsLoading(true);
    try {
      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: "event_creation_fee",
        description: "Event creation fee",
        amount: -amount,
        timestamp: new Date(),
        status: "completed",
        relatedItemId: eventId
      };
      
      setBalance(prevBalance => prevBalance - amount);
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast.success(`Event creation fee of ₹${amount} charged successfully`);
      return true;
    } catch (error) {
      console.error("Error charging event creation fee:", error);
      toast.error("Failed to charge event creation fee");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const chargeEventJoinFee = async (eventId: string, amount: number): Promise<boolean> => {
    if (!user) return false;
    if (amount <= 0) return true; // No fee
    if (amount > balance) {
      toast.error("Insufficient funds to join event");
      return false;
    }
    
    setIsLoading(true);
    try {
      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: "event_join_fee",
        description: "Event join fee",
        amount: -amount,
        timestamp: new Date(),
        status: "completed",
        relatedItemId: eventId
      };
      
      setBalance(prevBalance => prevBalance - amount);
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast.success(`Event join fee of ₹${amount} charged successfully`);
      return true;
    } catch (error) {
      console.error("Error charging event join fee:", error);
      toast.error("Failed to charge event join fee");
      return false;
    } finally {
      setIsLoading(false);
    }
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
