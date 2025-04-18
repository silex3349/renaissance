
import React, { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import WalletCard from "@/components/wallet/WalletCard";
import WalletActions from "@/components/wallet/WalletActions";
import TransactionHistory from "@/components/wallet/TransactionHistory";

const WalletPage = () => {
  const { balance, transactions, isLoading, depositFunds, withdrawFunds } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = async (amount: number) => {
    setIsProcessing(true);
    try {
      await depositFunds(amount);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async (amount: number) => {
    setIsProcessing(true);
    try {
      await withdrawFunds(amount);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="renaissance-container py-8">
      <div className="flex flex-col gap-6">
        <div>
          <WalletCard balance={balance} />
          <WalletActions 
            balance={balance}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            isProcessing={isProcessing}
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <TransactionHistory 
            transactions={transactions}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
