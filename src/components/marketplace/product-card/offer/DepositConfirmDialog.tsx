
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
  isUpdatingOffer?: boolean;
  additionalDepositAmount?: number;
}

export function DepositConfirmDialog({
  open,
  onOpenChange,
  offerAmount,
  productTitle,
  productId,
  onDepositComplete,
  isUpdatingOffer = false,
  additionalDepositAmount = 0
}: DepositConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Calculate deposit amount
  const depositAmount = isUpdatingOffer && additionalDepositAmount > 0 
    ? additionalDepositAmount 
    : Math.round(offerAmount * 0.1 * 100) / 100;
    
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
        productTitle,
        isAdditionalDeposit: isUpdatingOffer && additionalDepositAmount > 0
      });
      
      // Success - notify the user
      toast({
        title: isUpdatingOffer ? "Additional deposit initiated" : "Deposit initiated",
        description: isUpdatingOffer 
          ? "Your offer update process has been started. You will be notified when the seller responds."
          : "Your offer process has been started. You will be notified when the seller responds.",
      });
      
      onDepositComplete(escrowId);
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error initiating deposit:', error);
      setError(error.message || "An error occurred while setting up the deposit");
      
      toast({
        title: "Error",
        description: "There was an issue with your deposit. Your offer will still be sent but you may need to complete payment manually.",
        variant: "destructive",
      });
      
      // Even with an error, we'll proceed with the offer but mark it as manual deposit required
      onDepositComplete("manual");
      
      // We'll close the dialog after a short delay to let the user see the error
      setTimeout(() => {
        onOpenChange(false);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold exo-2-title">
            {isUpdatingOffer ? "Confirm Additional Deposit" : "Confirm Offer Deposit"}
          </DialogTitle>
          <DialogDescription>
            {isUpdatingOffer
              ? "You're increasing your offer by more than 20%, which requires an additional deposit."
              : "To verify your offer is genuine, we require a 10% deposit through our secure escrow service."}
          </DialogDescription>
        </DialogHeader>

        <DepositDetails 
          productTitle={productTitle}
          offerAmount={offerAmount}
          depositAmount={depositAmount}
          platformFee={platformFee}
          totalAmount={totalAmount}
          isAdditionalDeposit={isUpdatingOffer && additionalDepositAmount > 0}
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
            {isSubmitting ? "Processing..." : isUpdatingOffer ? "Pay Additional Deposit" : "Pay Deposit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
