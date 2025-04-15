
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface OfferFormProps {
  amount: string;
  message: string;
  formattedAmount: string;
  isSubmitting: boolean;
  productId: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onInitiateOffer: () => void;
  existingOffer: any;
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
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-3">
        {isUpdatingOffer 
          ? "Update your offer below."
          : "Make an offer to the seller. Unlike bids, offers can be below the current price but require seller approval."}
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Offer Amount
          </label>
          <div className="relative">
            <Input
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={onAmountChange}
              className="pl-8"
              disabled={isSubmitting}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</div>
          </div>
          {formattedAmount && (
            <p className="text-sm text-gray-500">{formattedAmount}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message (Optional)
          </label>
          <Textarea
            id="message"
            placeholder="Add a message to the seller"
            value={message}
            onChange={onMessageChange}
            disabled={isSubmitting}
            rows={3}
          />
        </div>
        
        <Button 
          onClick={onInitiateOffer} 
          disabled={isSubmitting || !amount}
          className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-1">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : isUpdatingOffer ? (
            "Update Offer"
          ) : (
            "Make Offer"
          )}
        </Button>
      </div>
    </div>
  );
}
