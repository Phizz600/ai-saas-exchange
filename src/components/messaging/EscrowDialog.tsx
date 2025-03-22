
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEscrowTransaction, initializeEscrowWithApi } from "@/integrations/supabase/escrow";
import { useToast } from "@/hooks/use-toast";

interface EscrowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  negotiatedPrice?: number;
  productTitle: string;
}

export const EscrowDialog = ({ 
  open, 
  onOpenChange, 
  conversationId,
  negotiatedPrice = 0,
  productTitle
}: EscrowDialogProps) => {
  const [amount, setAmount] = useState(negotiatedPrice);
  const [description, setDescription] = useState(`Purchase of ${productTitle}`);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const platformFee = calculatePlatformFee(amount);
  const total = amount;
  const sellerReceives = amount - platformFee;

  function calculatePlatformFee(amount: number): number {
    let feePercentage = 0.05; // Default 5%
    
    if (amount <= 10000) {
      feePercentage = 0.10; // 10%
    } else if (amount <= 50000) {
      feePercentage = 0.08; // 8%
    } else if (amount <= 100000) {
      feePercentage = 0.06; // 6%
    }
    
    return parseFloat((amount * feePercentage).toFixed(2));
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Create the escrow transaction record
      const transaction = await createEscrowTransaction(
        conversationId,
        amount,
        description
      );
      
      toast({
        title: "Escrow agreement created",
        description: "Both parties will need to review and sign the agreement."
      });
      
      // Initialize the escrow with the API
      await initializeEscrowWithApi(transaction.id);
      
      toast({
        title: "Escrow transaction initialized",
        description: "The escrow transaction has been created with Escrow.com."
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating escrow transaction:", error);
      toast({
        title: "Error creating escrow",
        description: error.message || "An error occurred while creating the escrow transaction.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">Create Escrow Transaction</DialogTitle>
          <DialogDescription className="text-center">
            Secure your transaction with Escrow.com. Both parties will need to agree to the terms.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Transaction Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder="Enter amount"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what's being purchased"
            />
          </div>
          
          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Transaction Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Transaction Amount:</span>
                <span>${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee:</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t mt-2">
                <span>Seller Receives:</span>
                <span>${sellerReceives.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || amount <= 0}
            className="min-w-[120px]"
          >
            {loading ? 
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div> : 
              "Create Escrow"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
