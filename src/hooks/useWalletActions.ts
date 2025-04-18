
import { toast } from "sonner";
import { updateCoins } from "@/utils/walletOperations";
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

    const { success, error } = await updateCoins({
      userId,
      amount,
      transactionType: type,
      description,
      details
    });

    if (success) {
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

  const chargeEventCreationFee = async (eventId: string, amount: number): Promise<boolean> => {
    if (!userId || amount <= 0) return true;
    if (amount > balance) {
      toast.error("Insufficient funds to create event");
      return false;
    }

    return processTransaction(
      -amount,
      "event_creation_fee",
      "Event creation fee",
      { eventId }
    );
  };

  const chargeEventJoinFee = async (eventId: string, amount: number): Promise<boolean> => {
    if (!userId || amount <= 0) return true;
    if (amount > balance) {
      toast.error("Insufficient funds to join event");
      return false;
    }

    return processTransaction(
      -amount,
      "event_join_fee",
      "Event join fee",
      { eventId }
    );
  };

  return {
    depositFunds,
    withdrawFunds,
    chargeEventCreationFee,
    chargeEventJoinFee
  };
};
