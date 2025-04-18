
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";
import { useState } from "react";

interface DepositDialogProps {
  onDeposit: (amount: number) => Promise<void>;
  isProcessing: boolean;
}

const DepositDialog = ({ onDeposit, isProcessing }: DepositDialogProps) => {
  const [depositAmount, setDepositAmount] = useState("");

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) return;
    await onDeposit(Number(depositAmount));
    setDepositAmount("");
  };

  return (
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
  );
};

export default DepositDialog;
