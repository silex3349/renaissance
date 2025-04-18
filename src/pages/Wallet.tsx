
import React, { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Wallet, ArrowDownCircle, ArrowUpCircle, Calendar, CreditCard, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const WalletPage = () => {
  const { balance, transactions, isLoading, depositFunds, withdrawFunds } = useWallet();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) return;
    
    setIsProcessing(true);
    try {
      await depositFunds(Number(depositAmount));
      setDepositAmount("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) return;
    
    setIsProcessing(true);
    try {
      await withdrawFunds(Number(withdrawAmount));
      setWithdrawAmount("");
    } finally {
      setIsProcessing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownCircle className="h-5 w-5 text-green-500" />;
      case "withdrawal":
        return <ArrowUpCircle className="h-5 w-5 text-red-500" />;
      case "event_creation_fee":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "event_join_fee":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="text-green-500 border-green-500">Completed</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case "failed":
        return <Badge variant="outline" className="text-red-500 border-red-500">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="renaissance-container py-8">
      <div className="flex flex-col gap-6">
        {/* Balance Card */}
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
          </CardContent>
        </Card>
        
        {/* Transaction History */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <Card className="border border-dashed p-8">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No transactions yet</h3>
                <p className="text-muted-foreground mt-1">
                  Add funds to your wallet or join events to see transactions here.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="overflow-hidden">
                  <div className="flex items-start p-4">
                    <div className="mr-3 mt-1">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            {transaction.type === 'deposit' ? 'Added Money' : 
                             transaction.type === 'withdrawal' ? 'Withdrew Money' :
                             transaction.type === 'event_creation_fee' ? 'Event Creation Fee' :
                             transaction.type === 'event_join_fee' ? 'Event Join Fee' : 'Transaction'}
                          </h3>
                          <p className="text-sm text-muted-foreground">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(transaction.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount > 0 ? '+' : ''}🪙{Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          <div className="mt-1">
                            {getTransactionStatusBadge(transaction.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
