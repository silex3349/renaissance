
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";
import { useState } from "react";

interface WalletActionsProps {
  balance: number;
  onDeposit: (amount: number) => Promise<void>;
  onWithdraw: (amount: number) => Promise<void>;
  isProcessing: boolean;
}

const WalletActions = ({ balance, onDeposit, onWithdraw, isProcessing }: WalletActionsProps) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) return;
    await onDeposit(Number(depositAmount));
    setDepositAmount("");
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) return;
    await onWithdraw(Number(withdrawAmount));
    setWithdrawAmount("");
  };

  return (
    <div className="flex gap-2 mt-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex-1" variant="default">Add Money</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Money to Wallet</DialogTitle>
            <DialogDescription>
              Enter the amount you want to add to your wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center">
              <span className="text-lg mr-2">🪙</span>
              <Input
                type="number"
                min="1"
                placeholder="Amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                Credit/Debit Card
              </Button>
              <Button variant="outline" className="flex-1">UPI</Button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleDeposit} 
              disabled={!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0 || isProcessing}
            >
              {isProcessing ? "Processing..." : "Add Money"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
    </div>
  );
};

export default WalletActions;
