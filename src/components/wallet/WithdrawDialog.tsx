
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface WithdrawDialogProps {
  balance: number;
  onWithdraw: (amount: number) => Promise<void>;
  isProcessing: boolean;
}

const WithdrawDialog = ({ balance, onWithdraw, isProcessing }: WithdrawDialogProps) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) return;
    await onWithdraw(Number(withdrawAmount));
    setWithdrawAmount("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1" variant="outline">Withdraw</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Money</DialogTitle>
          <DialogDescription>
            Enter the amount you want to withdraw from your wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center">
            <span className="text-lg mr-2">🪙</span>
            <Input
              type="number"
              min="1"
              max={balance}
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Available balance: 🪙{balance.toFixed(2)}
            </p>
          </div>
          
          <div className="mt-4">
            <p className="font-medium mb-2">Select Withdrawal Method</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">Bank Transfer</Button>
              <Button variant="outline" className="flex-1">UPI</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleWithdraw} 
            disabled={!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > balance || isProcessing}
          >
            {isProcessing ? "Processing..." : "Withdraw"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawDialog;
