
import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";

interface WalletBalanceProps {
  balance: number;
}

const WalletBalance = ({ balance }: WalletBalanceProps) => {
  return (
    <Link to="/wallet" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
      <Wallet className="h-5 w-5" />
      <span>🪙{balance.toFixed(2)}</span>
    </Link>
  );
};

export default WalletBalance;
