
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Wallet } from "lucide-react";

interface WalletPaymentProps {
  balance: number;
  amount: number;
}

const WalletPayment = ({ balance, amount }: WalletPaymentProps) => {
  const isDisabled = balance < amount;

  return (
    <Card className={`relative p-4 border-2 ${isDisabled ? "border-muted" : "border-primary"}`}>
      <RadioGroupItem
        value="wallet"
        id="wallet"
        className="absolute right-4 top-4"
        disabled={isDisabled}
      />
      <div className="flex items-start">
        <Wallet className="h-5 w-5 mr-3 mt-0.5 text-primary" />
        <div>
          <Label
            htmlFor="wallet"
            className={`font-medium ${isDisabled ? "text-muted-foreground" : ""}`}
          >
            Pay from Wallet
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Available balance: 🪙{balance.toFixed(2)}
          </p>
          {isDisabled && (
            <p className="text-xs text-red-500 mt-1">
              Insufficient balance. Please add money to your wallet.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WalletPayment;
