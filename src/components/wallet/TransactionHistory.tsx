
import { WalletTransaction } from "@/types/wallet";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowDownCircle, ArrowUpCircle, Calendar, CreditCard } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TransactionHistoryProps {
  transactions: WalletTransaction[];
  isLoading: boolean;
}

const TransactionHistory = ({ transactions, isLoading }: TransactionHistoryProps) => {
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

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="border border-dashed p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No transactions yet</h3>
          <p className="text-muted-foreground mt-1">
            Add funds to your wallet or join events to see transactions here.
          </p>
        </div>
      </Card>
    );
  }

  return (
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
  );
};

export default TransactionHistory;
