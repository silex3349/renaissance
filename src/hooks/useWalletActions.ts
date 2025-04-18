
import { toast } from "sonner";
import { updateCoins } from "@/utils/walletOperations";

export const useWalletActions = (userId: string | undefined, balance: number, refreshWallet: () => Promise<void>) => {
  const depositFunds = async (amount: number): Promise<boolean> => {
    if (!userId || amount <= 0) {
      toast.error("Invalid deposit amount");
      return false;
    }

    const success = await updateCoins(
      userId,
      amount,
      'deposit',
      'Added funds to wallet'
    );

    if (success) {
      toast.success(`Successfully added 🪙${amount} to your wallet`);
      await refreshWallet();
    }
    return success;
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

    const success = await updateCoins(
      userId,
      -amount,
      'withdrawal',
      'Withdrew funds from wallet'
    );

    if (success) {
      toast.success(`Successfully withdrew 🪙${amount} from your wallet`);
      await refreshWallet();
    }
    return success;
  };

  const chargeEventCreationFee = async (eventId: string, amount: number): Promise<boolean> => {
    if (!userId || amount <= 0) return true;
    if (amount > balance) {
      toast.error("Insufficient funds to create event");
      return false;
    }

    const success = await updateCoins(
      userId,
      -amount,
      'event_creation_fee',
      'Event creation fee',
      { eventId }
    );

    if (success) {
      toast.success(`Event creation fee of 🪙${amount} charged successfully`);
      await refreshWallet();
    }
    return success;
  };

  const chargeEventJoinFee = async (eventId: string, amount: number): Promise<boolean> => {
    if (!userId || amount <= 0) return true;
    if (amount > balance) {
      toast.error("Insufficient funds to join event");
      return false;
    }

    const success = await updateCoins(
      userId,
      -amount,
      'event_join_fee',
      'Event join fee',
      { eventId }
    );

    if (success) {
      toast.success(`Event join fee of 🪙${amount} charged successfully`);
      await refreshWallet();
    }
    return success;
  };

  return {
    depositFunds,
    withdrawFunds,
    chargeEventCreationFee,
    chargeEventJoinFee
  };
};
