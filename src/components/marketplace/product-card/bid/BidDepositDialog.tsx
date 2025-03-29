
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { initiateDeposit } from "./services/bid-deposit-service";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BidDepositDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (transactionId: string) => void;
  productId: string;
  bidAmount: number;
  productTitle: string;
}

export function BidDepositDialog({
  open,
  onClose,
  onConfirm,
  productId,
  bidAmount,
  productTitle,
}: BidDepositDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Calculate 10% deposit amount
  const depositAmount = Math.round(bidAmount * 0.1 * 100) / 100;
  // Platform fee (3% of deposit)
  const platformFee = Math.round(depositAmount * 0.03 * 100) / 100;
  const totalAmount = depositAmount + platformFee;

  const handleManualDeposit = () => {
    // For manual deposits, we'll use a special "manual" transaction id
    onConfirm("manual");
    onClose();
    
    toast({
      title: "Manual deposit selected",
      description: "Please contact support to arrange your deposit manually.",
    });
  };

  const handleInitiateDeposit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const escrowTransactionId = await initiateDeposit({
        productId,
        bidAmount,
        depositAmount,
        platformFee,
        productTitle
      });
      
      onConfirm(escrowTransactionId);
      onClose();
      
      toast({
        title: "Deposit initiated",
        description: "You'll be redirected to complete your deposit.",
      });
    } catch (error: any) {
      console.error('Deposit initiation error:', error);
      setError(error.message || "Failed to initiate deposit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Deposit Required</DialogTitle>
          <DialogDescription>
            To place a bid of ${bidAmount.toLocaleString()}, a 10% deposit is required to ensure you're a serious buyer.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-sm text-gray-500">Product</div>
            <div className="font-medium">{productTitle}</div>
            
            <div className="text-sm text-gray-500">Bid Amount</div>
            <div className="font-medium">${bidAmount.toLocaleString()}</div>
            
            <div className="text-sm text-gray-500">Deposit Amount (10%)</div>
            <div className="font-medium">${depositAmount.toLocaleString()}</div>
            
            <div className="text-sm text-gray-500">Platform Fee (3%)</div>
            <div className="font-medium">${platformFee.toLocaleString()}</div>
            
            <div className="text-sm text-gray-500 font-semibold">Total Due Now</div>
            <div className="font-bold">${totalAmount.toLocaleString()}</div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-sm space-y-2 mb-4">
            <p className="text-gray-500">
              Your deposit shows commitment and is fully refundable if your bid isn't accepted.
              If your bid is successful, the deposit will be applied toward the purchase.
            </p>
            
            <p className="text-green-600 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>100% Secure and Protected Transaction</span>
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleManualDeposit}
            disabled={isLoading}
          >
            Manual Deposit
          </Button>
          <Button
            onClick={handleInitiateDeposit}
            className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay Deposit Now"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
