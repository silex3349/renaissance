
import DepositDialog from "./DepositDialog";
import WithdrawDialog from "./WithdrawDialog";

interface WalletActionsProps {
  balance: number;
  onDeposit: (amount: number) => Promise<void>;
  onWithdraw: (amount: number) => Promise<void>;
  isProcessing: boolean;
}

const WalletActions = ({ balance, onDeposit, onWithdraw, isProcessing }: WalletActionsProps) => {
  return (
    <div className="flex gap-2 mt-4">
      <DepositDialog onDeposit={onDeposit} isProcessing={isProcessing} />
      <WithdrawDialog balance={balance} onWithdraw={onWithdraw} isProcessing={isProcessing} />
    </div>
  );
};

export default WalletActions;
