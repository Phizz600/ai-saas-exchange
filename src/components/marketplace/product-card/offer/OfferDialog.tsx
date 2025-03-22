
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  currentPrice,
  onClose 
}: OfferDialogProps) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [pendingOfferData, setPendingOfferData] = useState<{amount: number, message: string} | null>(null);
  const { toast } = useToast();

  const handleInitiateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to make an offer",
          variant: "destructive",
        });
        return;
      }

      const offerAmount = Number(amount.replace(/[^0-9.]/g, ''));
      
      // Store the offer data to use after deposit
      setPendingOfferData({
        amount: offerAmount,
        message
      });
      
      // Show deposit confirmation dialog
      setShowDepositDialog(true);

    } catch (error) {
      console.error('Error processing offer:', error);
      toast({
        title: "Error",
        description: "Failed to process offer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDepositComplete = async (escrowTransactionId: string) => {
    if (!pendingOfferData) return;
    
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Create the offer with deposit information
      const { error } = await supabase
        .from('offers')
        .insert({
          product_id: productId,
          bidder_id: user.id,
          amount: pendingOfferData.amount,
          message: pendingOfferData.message,
          deposit_status: 'deposit_pending',
          deposit_amount: pendingOfferData.amount * 0.1,
          deposit_transaction_id: escrowTransactionId
        });

      if (error) throw error;

      toast({
        title: "Offer submitted",
        description: "Your offer will be processed once the deposit is confirmed",
      });
      
      // Reset form and close dialog
      setAmount("");
      setMessage("");
      setPendingOfferData(null);
      onClose();
      
    } catch (error) {
      console.error('Error submitting offer:', error);
      toast({
        title: "Error",
        description: "Failed to submit offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to place a bid",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('bids')
        .insert({
          product_id: productId,
          bidder_id: user.id,
          amount: Number(amount),
        });

      if (error) throw error;

      toast({
        title: "Bid placed",
        description: "Your bid has been placed successfully",
      });
      onClose();

    } catch (error) {
      console.error('Error placing bid:', error);
      toast({
        title: "Error",
        description: "Failed to place bid. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Make an Offer</h3>
          <p className="text-sm text-gray-500 mb-4">
            Submit your offer for {productTitle}
          </p>
        </div>

        {isAuction ? (
          <Tabs defaultValue="bid" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bid">Place Bid</TabsTrigger>
              <TabsTrigger value="offer">Make Offer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bid">
              <form onSubmit={handleSubmitBid} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="bid-amount" className="text-sm font-medium">
                    Bid Amount ($)
                  </label>
                  <Input
                    id="bid-amount"
                    type="number"
                    min={currentPrice || 0}
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter your bid amount"
                  />
                  {currentPrice && (
                    <p className="text-sm text-gray-500">
                      Current price: ${currentPrice.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Placing bid..." : "Place Bid"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="offer">
              <form onSubmit={handleInitiateOffer} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="offer-amount" className="text-sm font-medium">
                    Offer Amount ($)
                  </label>
                  <Input
                    id="offer-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter your offer amount"
                  />
                  <p className="text-xs text-amber-600">
                    A 10% deposit will be required to verify your offer
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message (optional)
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a message to the seller"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Continue to Deposit"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        ) : (
          <form onSubmit={handleInitiateOffer} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Offer Amount ($)
              </label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter your offer amount"
              />
              <p className="text-xs text-amber-600">
                A 10% deposit will be required to verify your offer
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message (optional)
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message to the seller"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Continue to Deposit"}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Deposit confirmation dialog */}
      <DepositConfirmDialog
        open={showDepositDialog}
        onOpenChange={setShowDepositDialog}
        offerAmount={pendingOfferData?.amount || 0}
        productTitle={productTitle}
        productId={productId}
        onDepositComplete={handleDepositComplete}
      />
    </>
  );
}
