
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Wallet, CreditCard, Landmark } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "sonner";
import { useNotifications } from "@/contexts/NotificationContext";

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
        // Process payment using wallet
        if (purpose === "event_creation") {
          success = await chargeEventCreationFee(eventId, amount);
        } else {
          success = await chargeEventJoinFee(eventId, amount);
        }
      } else {
        // Simulate payment processing through other methods
        await new Promise(resolve => setTimeout(resolve, 2000));
        success = true;
        
        // Add notification for payment
        addNotification({
          type: "paymentCompleted",
          message: `Payment of ₹${amount} for ${purpose === "event_creation" ? "creating" : "joining"} ${eventName} was successful.`,
          actionUrl: purpose === "event_creation" ? `/events/create` : `/events/${eventId}`
        });
      }
      
      if (success) {
        toast.success("Payment successful!");
        onPaymentComplete();
      } else {
        toast.error("Payment failed. Please try again.");
        
        // Add notification for failed payment
        addNotification({
          type: "paymentFailed",
          message: `Payment of ₹${amount} for ${purpose === "event_creation" ? "creating" : "joining"} ${eventName} failed.`,
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

  const formatCardNumber = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    
    return digits;
  };

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
              <p className="text-xl font-bold">₹{amount.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              className="space-y-3"
            >
              <div>
                <Card className={`relative p-4 border-2 ${paymentMethod === "wallet" ? "border-primary" : "border-muted"}`}>
                  <RadioGroupItem
                    value="wallet"
                    id="wallet"
                    className="absolute right-4 top-4"
                    disabled={balance < amount}
                  />
                  <div className="flex items-start">
                    <Wallet className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <Label
                        htmlFor="wallet"
                        className={`font-medium ${balance < amount ? "text-muted-foreground" : ""}`}
                      >
                        Pay from Wallet
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Available balance: ₹{balance.toFixed(2)}
                      </p>
                      {balance < amount && (
                        <p className="text-xs text-red-500 mt-1">
                          Insufficient balance. Please add money to your wallet.
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
              
              <div>
                <Card className={`relative p-4 border-2 ${paymentMethod === "card" ? "border-primary" : "border-muted"}`}>
                  <RadioGroupItem
                    value="card"
                    id="card"
                    className="absolute right-4 top-4"
                  />
                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <Label
                        htmlFor="card"
                        className="font-medium"
                      >
                        Credit/Debit Card
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pay using Visa, Mastercard, or Rupay
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div>
                <Card className={`relative p-4 border-2 ${paymentMethod === "banking" ? "border-primary" : "border-muted"}`}>
                  <RadioGroupItem
                    value="banking"
                    id="banking"
                    className="absolute right-4 top-4"
                  />
                  <div className="flex items-start">
                    <Landmark className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <Label
                        htmlFor="banking"
                        className="font-medium"
                      >
                        Net Banking/UPI
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pay using your bank account or UPI
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </RadioGroup>
            
            {/* Card payment form */}
            {paymentMethod === "card" && (
              <div className="space-y-4 mt-6 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength={5}
                    />
                  </div>
                  
                  <div className="space-y-2 w-24">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                      maxLength={3}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nameOnCard">Name on Card</Label>
                  <Input
                    id="nameOnCard"
                    placeholder="John Doe"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {/* Banking/UPI form */}
            {paymentMethod === "banking" && (
              <div className="space-y-4 mt-6 pt-4 border-t">
                <div className="grid gap-2 grid-cols-2">
                  <Button variant="outline" className="p-6 h-auto flex flex-col">
                    <img 
                      src="https://api.dicebear.com/7.x/shapes/svg?seed=bank1" 
                      alt="Bank 1" 
                      className="h-8 w-8 mb-2" 
                    />
                    <span className="text-xs">HDFC Bank</span>
                  </Button>
                  
                  <Button variant="outline" className="p-6 h-auto flex flex-col">
                    <img 
                      src="https://api.dicebear.com/7.x/shapes/svg?seed=bank2" 
                      alt="Bank 2"
                      className="h-8 w-8 mb-2" 
                    />
                    <span className="text-xs">ICICI Bank</span>
                  </Button>
                  
                  <Button variant="outline" className="p-6 h-auto flex flex-col">
                    <img 
                      src="https://api.dicebear.com/7.x/shapes/svg?seed=bank3" 
                      alt="Bank 3"
                      className="h-8 w-8 mb-2" 
                    />
                    <span className="text-xs">SBI</span>
                  </Button>
                  
                  <Button variant="outline" className="p-6 h-auto flex flex-col">
                    <img 
                      src="https://api.dicebear.com/7.x/shapes/svg?seed=bank4" 
                      alt="Bank 4"
                      className="h-8 w-8 mb-2" 
                    />
                    <span className="text-xs">Axis Bank</span>
                  </Button>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label>UPI ID</Label>
                  <div className="flex gap-2">
                    <Input placeholder="yourname@upi" className="flex-1" />
                    <Button type="button" className="shrink-0">Verify</Button>
                  </div>
                </div>
              </div>
            )}
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
            {isProcessing ? "Processing..." : `Pay ₹${amount.toFixed(2)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
