
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DepositConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offerAmount: number;
  productTitle: string;
  productId: string;
  onDepositComplete: (escrowId: string) => void;
}

export function DepositConfirmDialog({
  open,
  onOpenChange,
  offerAmount,
  productTitle,
  productId,
  onDepositComplete
}: DepositConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Calculate deposit amount (10% of offer)
  const depositAmount = Math.round(offerAmount * 0.1 * 100) / 100;
  const platformFee = Math.round(depositAmount * 0.05 * 100) / 100;
  const totalAmount = depositAmount + platformFee;

  const handleInitiateDeposit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to make a deposit");
      }
      
      // Get the seller information
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('seller_id, title, seller:profiles!products_seller_id_fkey(full_name, email)')
        .eq('id', productId)
        .single();
        
      if (productError || !product) {
        throw new Error("Could not retrieve product information");
      }
      
      // Get buyer information
      const { data: buyer, error: buyerError } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();
        
      if (buyerError || !buyer) {
        throw new Error("Could not retrieve your profile information");
      }

      // Fix: Properly accessing the seller information from the join result
      // TypeScript is interpreting seller as an array of objects, but it's actually a nested object
      const sellerData = product.seller as unknown as { full_name?: string; email?: string } || {};
      const sellerName = sellerData.full_name || 'Seller';
      const sellerEmail = sellerData.email || '';

      // Create escrow transaction for deposit
      const { data: escrowTransaction, error: escrowError } = await supabase
        .from('escrow_transactions')
        .insert({
          product_id: productId,
          seller_id: product.seller_id,
          buyer_id: user.id,
          amount: depositAmount,
          platform_fee: platformFee,
          escrow_fee: 0, // No escrow fee for deposits
          description: `Deposit for offer on ${product.title}`,
          status: 'deposit_pending'
        })
        .select()
        .single();

      if (escrowError || !escrowTransaction) {
        throw new Error("Failed to create escrow transaction for deposit");
      }

      // Initialize escrow with Escrow.com API
      const response = await supabase.functions.invoke('escrow-api', {
        body: {
          action: 'create',
          data: {
            internal_transaction_id: escrowTransaction.id,
            description: `Deposit for offer on ${product.title}`,
            amount: depositAmount,
            buyer_id: user.id,
            buyer_name: buyer.full_name || 'Buyer',
            buyer_email: buyer.email || user.email,
            seller_id: product.seller_id,
            seller_name: sellerName,
            seller_email: sellerEmail,
            timeline: '14 days',
            platform_fee: platformFee,
            product_id: productId
          }
        }
      });

      if (response.error) {
        throw new Error(`Escrow API error: ${response.error}`);
      }

      // Success - notify the user
      toast({
        title: "Deposit initiated",
        description: "Please complete the payment through Escrow.com",
      });
      
      onDepositComplete(escrowTransaction.id);
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error initiating deposit:', error);
      setError(error.message || "An error occurred while setting up the deposit");
      
      toast({
        title: "Error",
        description: "Failed to initiate deposit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Confirm Offer Deposit</DialogTitle>
          <DialogDescription>
            To verify your offer is genuine, we require a 10% deposit through our secure escrow service.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-md">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p>This deposit confirms your serious interest and will be:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Applied to your full payment if the offer is accepted</li>
                <li>Fully refunded if the offer is declined</li>
                <li>Securely held in escrow throughout the process</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Deposit Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Product:</span>
                <span className="font-medium">{productTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Offer Amount:</span>
                <span className="font-medium">${offerAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deposit (10%):</span>
                <span className="font-medium">${depositAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee:</span>
                <span className="font-medium">${platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t mt-2">
                <span className="text-gray-800 font-medium">Total Due Now:</span>
                <span className="font-bold">${totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleInitiateDeposit} 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]"
          >
            {isSubmitting ? "Processing..." : "Pay Deposit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
