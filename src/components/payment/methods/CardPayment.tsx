
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";

interface CardPaymentProps {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
  onCardNumberChange: (value: string) => void;
  onExpiryDateChange: (value: string) => void;
  onCvvChange: (value: string) => void;
  onNameChange: (value: string) => void;
}

const CardPayment = ({
  cardNumber,
  expiryDate,
  cvv,
  nameOnCard,
  onCardNumberChange,
  onExpiryDateChange,
  onCvvChange,
  onNameChange,
}: CardPaymentProps) => {
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    return digits;
  };

  return (
    <>
      <Card className={`relative p-4 border-2 border-primary`}>
        <RadioGroupItem
          value="card"
          id="card"
          className="absolute right-4 top-4"
        />
        <div className="flex items-start">
          <CreditCard className="h-5 w-5 mr-3 mt-0.5 text-primary" />
          <div>
            <Label htmlFor="card" className="font-medium">
              Credit/Debit Card
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Pay using Visa, Mastercard, or Rupay
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-4 mt-6 pt-4 border-t">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => onCardNumberChange(formatCardNumber(e.target.value))}
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
              onChange={(e) => onExpiryDateChange(formatExpiryDate(e.target.value))}
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
              onChange={(e) => onCvvChange(e.target.value.replace(/\D/g, '').substring(0, 3))}
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
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default CardPayment;
