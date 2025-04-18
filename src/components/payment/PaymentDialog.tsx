
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
  purpose: "event_creation" | "event_join" | "group_creation" | "group_join";
  itemId: string;
  itemName: string;
  onPaymentComplete: () => void;
  onPaymentCancel: () => void;
}

type PaymentMethod = "wallet" | "card" | "banking";

const PaymentDialog = ({
  open,
  onOpenChange,
  amount,
  purpose,
  itemId,
  itemName,
  onPaymentComplete,
  onPaymentCancel
}: PaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wallet");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  const { 
    balance, 
    chargeEventCreationFee, 
    chargeEventJoinFee,
    chargeGroupCreationFee,
    chargeGroupJoinFee 
  } = useWallet();
  const { addNotification } = useNotifications();

  const getPurposeDisplay = () => {
    switch (purpose) {
      case "event_creation": return "creating event";
      case "event_join": return "joining event"; 
      case "group_creation": return "creating group";
      case "group_join": return "joining group";
      default: return purpose;
    }
  };

  const getRedirectUrl = () => {
    switch (purpose) {
      case "event_creation": return `/events/create`;
      case "event_join": return `/events/${itemId}`;
      case "group_creation": return `/groups`;
      case "group_join": return `/groups/${itemId}`;
      default: return "/";
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      let success = false;
      
      if (paymentMethod === "wallet") {
        switch (purpose) {
          case "event_creation":
            success = await chargeEventCreationFee(itemId, amount);
            break;
          case "event_join":
            success = await chargeEventJoinFee(itemId, amount);
            break;
          case "group_creation":
            success = await chargeGroupCreationFee(itemId, amount);
            break;
          case "group_join":
            success = await chargeGroupJoinFee(itemId, amount);
            break;
        }
      } else {
        // Simulate payment processing for card and banking
        await new Promise(resolve => setTimeout(resolve, 2000));
        success = true;
        
        // Add notification for other payment methods
        addNotification({
          type: "paymentCompleted",
          message: `Payment of 🪙${amount} for ${getPurposeDisplay()} ${itemName} was successful.`,
          actionUrl: getRedirectUrl()
        });
      }
      
      if (success) {
        toast.success("Payment successful!");
        onPaymentComplete();
      } else {
        toast.error("Payment failed. Please try again.");
        
        addNotification({
          type: "paymentFailed",
          message: `Payment of 🪙${amount} for ${getPurposeDisplay()} ${itemName} failed.`,
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

  const getPaymentTitle = () => {
    switch (purpose) {
      case "event_creation": return "Pay Event Creation Fee";
      case "event_join": return "Pay Event Join Fee";
      case "group_creation": return "Pay Group Creation Fee";
      case "group_join": return "Pay Group Join Fee";
      default: return "Make Payment";
    }
  };

  const getPaymentDescription = () => {
    switch (purpose) {
      case "event_creation": return "Fee for creating event:";
      case "event_join": return "Fee for joining event:";
      case "group_creation": return "Fee for creating group:";
      case "group_join": return "Fee for joining group:";
      default: return "Fee for:";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getPaymentTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground">
                {getPaymentDescription()}
              </p>
              <p className="font-medium">{itemName}</p>
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
