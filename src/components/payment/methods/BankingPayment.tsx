
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Landmark } from "lucide-react";

const BankingPayment = () => {
  return (
    <>
      <Card className={`relative p-4 border-2 border-primary`}>
        <RadioGroupItem
          value="banking"
          id="banking"
          className="absolute right-4 top-4"
        />
        <div className="flex items-start">
          <Landmark className="h-5 w-5 mr-3 mt-0.5 text-primary" />
          <div>
            <Label htmlFor="banking" className="font-medium">
              Net Banking/UPI
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Pay using your bank account or UPI
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-4 mt-6 pt-4 border-t">
        <div className="grid gap-2 grid-cols-2">
          {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map((bank, index) => (
            <Button key={bank} variant="outline" className="p-6 h-auto flex flex-col">
              <img
                src={`https://api.dicebear.com/7.x/shapes/svg?seed=bank${index + 1}`}
                alt={bank}
                className="h-8 w-8 mb-2"
              />
              <span className="text-xs">{bank}</span>
            </Button>
          ))}
        </div>

        <div className="space-y-2 mt-4">
          <Label>UPI ID</Label>
          <div className="flex gap-2">
            <Input placeholder="yourname@upi" className="flex-1" />
            <Button type="button" className="shrink-0">
              Verify
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BankingPayment;
