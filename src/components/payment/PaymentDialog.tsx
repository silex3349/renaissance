
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { useWallet } from "@/contexts/WalletContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { toast } from "sonner";
import WalletPayment from "./methods/WalletPayment";
import CardPayment from "./methods/CardPayment";
import BankingPayment from "./methods/BankingPayment";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  purpose: "event_creation" | "event_join";
  eventId: string;
  eventName: string;
  onPaymentComplete: () => void;
  onPaymentCancel: () => void;
}

type PaymentMethod = "wallet" | "card" | "banking";

const PaymentDialog = ({
  open,
  onOpenChange,
  amount,
  purpose,
  eventId,
  eventName,
  onPaymentComplete,
  onPaymentCancel
}: PaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wallet");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  const { balance, chargeEventCreationFee, chargeEventJoinFee } = useWallet();
  const { addNotification } = useNotifications();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      let success = false;
      
      if (paymentMethod === "wallet") {
        if (purpose === "event_creation") {
          success = await chargeEventCreationFee(eventId, amount);
        } else {
          success = await chargeEventJoinFee(eventId, amount);
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        success = true;
        
        addNotification({
          type: "paymentCompleted",
          message: `Payment of 🪙${amount} for ${purpose === "event_creation" ? "creating" : "joining"} ${eventName} was successful.`,
          actionUrl: purpose === "event_creation" ? `/events/create` : `/events/${eventId}`
        });
      }
      
      if (success) {
        toast.success("Payment successful!");
        onPaymentComplete();
      } else {
        toast.error("Payment failed. Please try again.");
        
        addNotification({
          type: "paymentFailed",
          message: `Payment of 🪙${amount} for ${purpose === "event_creation" ? "creating" : "joining"} ${eventName} failed.`,
          actionUrl: "/wallet"
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred during payment processing");
    } finally {
      setIsProcessing(false);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onPaymentCancel();
    onOpenChange(false);
  };

  const isWalletDisabled = paymentMethod === "wallet" && balance < amount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {purpose === "event_creation" 
              ? "Pay Event Creation Fee" 
              : "Pay Event Join Fee"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground">
                {purpose === "event_creation" 
                  ? "Fee for creating event:" 
                  : "Fee for joining event:"}
              </p>
              <p className="font-medium">{eventName}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold flex items-center justify-end">
                <span className="text-lg mr-1">🪙</span>
                {amount.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              className="space-y-3"
            >
              <WalletPayment balance={balance} amount={amount} />
              
              <div>
                <CardPayment 
                  cardNumber={cardNumber}
                  expiryDate={expiryDate}
                  cvv={cvv}
                  nameOnCard={nameOnCard}
                  onCardNumberChange={setCardNumber}
                  onExpiryDateChange={setExpiryDate}
                  onCvvChange={setCvv}
                  onNameChange={setNameOnCard}
                />
              </div>
              
              <div>
                <BankingPayment />
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handlePayment} 
            disabled={isProcessing || isWalletDisabled || 
              (paymentMethod === "card" && 
                (cardNumber.length < 19 || 
                expiryDate.length < 5 || 
                cvv.length < 3 || 
                !nameOnCard))}
          >
            {isProcessing ? "Processing..." : `Pay 🪙${amount.toFixed(2)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
