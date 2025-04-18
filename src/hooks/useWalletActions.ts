
import { toast } from "sonner";
import { updateCoins, calculateEventFee, updateUserStats } from "@/utils/walletOperations";
import { TransactionType } from "@/types/wallet";

export const useWalletActions = (userId: string | undefined, balance: number, refreshWallet: () => Promise<void>) => {
  const processTransaction = async (
    amount: number,
    type: TransactionType,
    description: string,
    details?: Record<string, any>
  ) => {
    if (!userId) {
      toast.error("User not authenticated");
      return false;
    }

    const { success, error, newBalance } = await updateCoins({
      userId,
      amount,
      transactionType: type,
      description,
      details
    });

    if (success) {
      // Update user stats based on transaction type
      if (type === "event_creation_fee") {
        await updateUserStats(userId, "events_created");
      } else if (type === "event_join_fee") {
        await updateUserStats(userId, "events_joined");
      } else if (type === "group_creation_fee") {
        await updateUserStats(userId, "groups_created");
      } else if (type === "group_join_fee") {
        await updateUserStats(userId, "groups_joined");
      }
      
      await refreshWallet();
    } else if (error) {
      toast.error(error);
    }

    return success;
  };

  const depositFunds = async (amount: number): Promise<boolean> => {
    if (!userId || amount <= 0) {
      toast.error("Invalid deposit amount");
      return false;
    }

    return processTransaction(amount, "deposit", "Added funds to wallet");
  };

  const withdrawFunds = async (amount: number): Promise<boolean> => {
    if (!userId || amount <= 0) {
      toast.error("Invalid withdrawal amount");
      return false;
    }

    if (amount > balance) {
      toast.error("Insufficient funds");
      return false;
    }

    return processTransaction(-amount, "withdrawal", "Withdrew funds from wallet");
  };

  const chargeEventCreationFee = async (eventId: string, baseAmount: number): Promise<boolean> => {
    if (!userId) return false;
    if (baseAmount <= 0) return true; // No charge needed
    
    // Calculate fee based on user category
    const finalAmount = await calculateEventFee(baseAmount, userId);
    
    if (finalAmount > balance) {
      toast.error("Insufficient funds to create event");
      return false;
    }

    return processTransaction(
      -finalAmount,
      "event_creation_fee",
      "Event creation fee",
      { eventId, baseAmount, finalAmount }
    );
  };

  const chargeEventJoinFee = async (eventId: string, baseAmount: number): Promise<boolean> => {
    if (!userId) return false;
    if (baseAmount <= 0) return true; // No charge needed
    
    // Calculate fee based on user category
    const finalAmount = await calculateEventFee(baseAmount, userId);
    
    if (finalAmount > balance) {
      toast.error("Insufficient funds to join event");
      return false;
    }

    return processTransaction(
      -finalAmount,
      "event_join_fee",
      "Event join fee",
      { eventId, baseAmount, finalAmount }
    );
  };
  
  const chargeGroupCreationFee = async (groupId: string, amount: number): Promise<boolean> => {
    if (!userId || amount <= 0) return true;
    if (amount > balance) {
      toast.error("Insufficient funds to create group");
      return false;
    }

    return processTransaction(
      -amount,
      "group_creation_fee",
      "Group creation fee",
      { groupId }
    );
  };
  
  const chargeGroupJoinFee = async (groupId: string, amount: number): Promise<boolean> => {
    if (!userId || amount <= 0) return true;
    if (amount > balance) {
      toast.error("Insufficient funds to join group");
      return false;
    }

    return processTransaction(
      -amount,
      "group_join_fee",
      "Group join fee",
      { groupId }
    );
  };

  return {
    depositFunds,
    withdrawFunds,
    chargeEventCreationFee,
    chargeEventJoinFee,
    chargeGroupCreationFee,
    chargeGroupJoinFee
  };
};
