
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface WalletCardProps {
  balance: number;
}

const WalletCard = ({ balance }: WalletCardProps) => {
  return (
    <Card className="border-2 border-primary shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center">Your Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-4">
          <Wallet className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-3xl font-bold flex items-center">
            <span className="text-xl mr-1 text-secondary-foreground">🪙</span>
            {balance.toFixed(2)}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Available Balance</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
