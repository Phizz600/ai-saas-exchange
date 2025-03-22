
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DepositDetails } from "./components/DepositDetails";
import { initiateDeposit } from "./services/deposit-service";

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
      const escrowId = await initiateDeposit({
        productId,
        offerAmount,
        depositAmount,
        platformFee,
        productTitle
      });
      
      // Success - notify the user
      toast({
        title: "Deposit initiated",
        description: "Please complete the payment through Escrow.com",
      });
      
      onDepositComplete(escrowId);
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
          <DialogTitle className="text-xl font-semibold exo-2-title">Confirm Offer Deposit</DialogTitle>
          <DialogDescription>
            To verify your offer is genuine, we require a 10% deposit through our secure escrow service.
          </DialogDescription>
        </DialogHeader>

        <DepositDetails 
          productTitle={productTitle}
          offerAmount={offerAmount}
          depositAmount={depositAmount}
          platformFee={platformFee}
          totalAmount={totalAmount}
        />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
