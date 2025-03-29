import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CircleDollarSign, LockIcon } from "lucide-react";
interface OfferFormProps {
  amount: string;
  message: string;
  formattedAmount: string;
  isSubmitting: boolean;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onInitiateOffer: () => void;
}
export function OfferForm({
  amount,
  message,
  formattedAmount,
  isSubmitting,
  onAmountChange,
  onMessageChange,
  onInitiateOffer
}: OfferFormProps) {
  return <div className="space-y-4">
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
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Offer Amount</Label>
          <div className="relative">
            <Input id="amount" placeholder="Enter amount" value={amount} onChange={onAmountChange} className="pl-7" />
            <CircleDollarSign className="h-4 w-4 text-gray-400 absolute left-2 top-3" />
          </div>
          {formattedAmount && <div className="text-sm text-gray-600 flex justify-between">
              <span>Your offer: {formattedAmount}</span>
              <span>Required deposit: ${Math.round(parseFloat(amount) * 0.1 * 100) / 100}</span>
            </div>}
        </div>
        
        
        
        <Button onClick={onInitiateOffer} disabled={isSubmitting || !amount} className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]">
          {isSubmitting ? "Processing..." : "Continue to Deposit"}
        </Button>
      </div>
    </div>;
}