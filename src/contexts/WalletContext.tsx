
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { WalletTransaction } from "@/types/wallet";
import { fetchWalletData } from "@/utils/walletOperations";
import { useWalletActions } from "@/hooks/useWalletActions";

interface WalletContextType {
  balance: number;
  transactions: WalletTransaction[];
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
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshWallet = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await fetchWalletData(user.id);
      if (data) {
        setBalance(data.balance);
        setTransactions(data.transactions);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const walletActions = useWalletActions(user?.id, balance, refreshWallet);

  useEffect(() => {
    if (user) {
      refreshWallet();
    } else {
      setBalance(0);
      setTransactions([]);
      setIsLoading(false);
    }
  }, [user]);

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        ...walletActions,
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
