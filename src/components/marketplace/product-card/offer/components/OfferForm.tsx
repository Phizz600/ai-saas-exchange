
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CircleDollarSign, LockIcon, HistoryIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OfferFormProps {
  amount: string;
  message: string;
  formattedAmount: string;
  isSubmitting: boolean;
  productId: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onInitiateOffer: () => void;
  existingOffer: any | null;
  isUpdatingOffer: boolean;
}

export function OfferForm({
  amount,
  message,
  formattedAmount,
  isSubmitting,
  productId,
  onAmountChange,
  onMessageChange,
  onInitiateOffer,
  existingOffer,
  isUpdatingOffer
}: OfferFormProps) {
  const { toast } = useToast();
  const [additionalDeposit, setAdditionalDeposit] = useState(0);

  // Calculate if additional deposit is needed when updating an offer
  useEffect(() => {
    if (existingOffer && amount) {
      const newAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));
      const originalAmount = existingOffer.amount;
      const originalDeposit = existingOffer.deposit_amount;
      
      // If new amount is more than 20% higher than the original, require additional deposit
      if (newAmount > originalAmount * 1.2) {
        const newDepositTotal = Math.round(newAmount * 0.1 * 100) / 100;
        const additionalDepositNeeded = Math.round((newDepositTotal - originalDeposit) * 100) / 100;
        setAdditionalDeposit(additionalDepositNeeded > 0 ? additionalDepositNeeded : 0);
      } else {
        setAdditionalDeposit(0);
      }
    }
  }, [existingOffer, amount]);

  return <div className="space-y-4">
      {isUpdatingOffer ? (
        <div className="bg-amber-50 border border-amber-100 rounded-md p-3 mb-4">
          <div className="flex gap-2 items-center text-amber-600 font-medium mb-1">
            <HistoryIcon className="h-4 w-4" />
            <span>Updating Your Previous Offer</span>
          </div>
          <p className="text-sm text-amber-700">
            You're updating your previous offer of ${existingOffer?.amount.toLocaleString()}. Your existing deposit will be applied.
          </p>
          {additionalDeposit > 0 && (
            <p className="text-sm text-amber-700 mt-1 font-medium">
              Additional deposit required: ${additionalDeposit.toLocaleString()} (for increase over 20%)
            </p>
          )}
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
          <div className="flex gap-2 items-center text-blue-600 font-medium mb-1">
            <LockIcon className="h-4 w-4" />
            <span>Verified Offers Only</span>
          </div>
          <p className="text-sm text-blue-700">
            To ensure serious offers, we require a 10% deposit that will be:
          </p>
          <ul className="text-sm text-blue-700 list-disc pl-5 mt-1">
            <li>Applied to your purchase if accepted</li>
            <li>Fully refunded if declined</li>
            <li>Held securely in escrow throughout</li>
          </ul>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Offer Amount</Label>
          <div className="relative">
            <Input id="amount" placeholder="Enter amount" value={amount} onChange={onAmountChange} className="pl-7" />
            <CircleDollarSign className="h-4 w-4 text-gray-400 absolute left-2 top-3" />
          </div>
          {formattedAmount && <div className="text-sm text-gray-600 flex justify-between">
              <span>Your offer: {formattedAmount}</span>
              <span>
                {isUpdatingOffer 
                  ? `Total deposit: ${Math.round((existingOffer?.deposit_amount + additionalDeposit) * 100) / 100}`
                  : `Required deposit: $${Math.round(parseFloat(amount.replace(/[^0-9.]/g, '')) * 0.1 * 100) / 100}`
                }
              </span>
            </div>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Message (Optional)</Label>
          <Textarea 
            id="message" 
            placeholder="Include any additional details about your offer..." 
            value={message} 
            onChange={onMessageChange}
            rows={3}
          />
        </div>
        
        <Button 
          onClick={onInitiateOffer} 
          disabled={isSubmitting || !amount} 
          className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]"
        >
          {isSubmitting 
            ? "Processing..." 
            : isUpdatingOffer 
              ? additionalDeposit > 0 
                ? "Continue to Additional Deposit" 
                : "Update Offer"
              : "Continue to Deposit"
          }
        </Button>
      </div>
    </div>;
}
