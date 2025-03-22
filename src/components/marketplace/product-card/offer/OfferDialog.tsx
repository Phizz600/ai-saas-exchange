
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, LockIcon, CircleDollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DepositConfirmDialog } from "./DepositConfirmDialog";

interface OfferDialogProps {
  productId: string;
  productTitle: string;
  isAuction?: boolean;
  currentPrice?: number;
  onClose: () => void;
}

export function OfferDialog({ 
  productId, 
  productTitle,
  isAuction,
  currentPrice = 0,
  onClose 
}: OfferDialogProps) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState("");
  const { toast } = useToast();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters except period
    let value = e.target.value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit decimal places to 2
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    setAmount(value);
    
    // Format for display
    if (value) {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        setFormattedAmount(`$${numericValue.toLocaleString()}`);
      } else {
        setFormattedAmount("");
      }
    } else {
      setFormattedAmount("");
    }
  };

  const handleInitiateOffer = async () => {
    const numericAmount = parseFloat(amount);
    
    // Validate amount
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount for your offer.",
        variant: "destructive",
      });
      return;
    }

    // For auction listings, validate against the current price
    if (isAuction && currentPrice && numericAmount <= currentPrice) {
      toast({
        title: "Amount too low",
        description: `Your offer must be higher than the current price of $${currentPrice.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }
    
    // Open deposit dialog
    setDepositDialogOpen(true);
  };
  
  const handleOfferSubmit = async (escrowTransactionId: string) => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to make an offer",
          variant: "destructive",
        });
        return;
      }
      
      const numericAmount = parseFloat(amount);
      const depositAmount = Math.round(numericAmount * 0.1 * 100) / 100; // 10% deposit
      
      // Create the offer with deposit information
      const { data: offer, error: offerError } = await supabase
        .from('offers')
        .insert({
          product_id: productId,
          bidder_id: user.id,
          amount: numericAmount,
          message: message,
          status: 'deposit_pending',
          deposit_status: 'deposit_pending',
          deposit_amount: depositAmount,
          deposit_transaction_id: escrowTransactionId
        })
        .select()
        .single();
      
      if (offerError) {
        throw offerError;
      }
      
      // Create a link between the deposit transaction and the offer
      await supabase.from('deposit_transactions').insert({
        offer_id: offer.id,
        amount: depositAmount,
        escrow_transaction_id: escrowTransactionId,
        status: 'pending'
      });
      
      // Success
      setSuccess(true);
      
      toast({
        title: "Offer initiated!",
        description: "Once your deposit is confirmed, your offer will be submitted to the seller.",
      });
      
      // Reset form
      setAmount("");
      setMessage("");
      setFormattedAmount("");
      
    } catch (error: any) {
      console.error("Error creating offer:", error);
      
      toast({
        title: "Failed to create offer",
        description: error.message || "An error occurred while creating your offer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div className="space-y-4">
        <div className="text-center mb-2">
          <h2 className="text-xl font-semibold">Make an Offer</h2>
          <p className="text-sm text-gray-500">
            {productTitle}
          </p>
        </div>
        
        {success ? (
          <div className="py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Offer Initiated!</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Your deposit has been initiated. Once confirmed, your offer will be submitted to the seller.
              </p>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        ) : (
          <>
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
                  <Input
                    id="amount"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={handleAmountChange}
                    className="pl-7"
                  />
                  <CircleDollarSign className="h-4 w-4 text-gray-400 absolute left-2 top-3" />
                </div>
                {formattedAmount && (
                  <div className="text-sm text-gray-600 flex justify-between">
                    <span>Your offer: {formattedAmount}</span>
                    <span>Required deposit: ${Math.round(parseFloat(amount) * 0.1 * 100) / 100}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Tell the seller why you're interested..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleInitiateOffer}
                disabled={isSubmitting || !amount}
                className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]"
              >
                {isSubmitting ? "Processing..." : "Continue to Deposit"}
              </Button>
            </div>
          </>
        )}
      </div>
      
      <DepositConfirmDialog 
        open={depositDialogOpen}
        onOpenChange={setDepositDialogOpen}
        offerAmount={parseFloat(amount) || 0}
        productTitle={productTitle}
        productId={productId}
        onDepositComplete={handleOfferSubmit}
      />
    </>
  );
}
