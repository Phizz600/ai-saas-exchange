
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEscrowPayment } from "./hooks/useEscrowPayment";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface EscrowPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: any;
  onStatusChange: () => void;
}

export const EscrowPaymentDialog: React.FC<EscrowPaymentDialogProps> = ({
  open,
  onOpenChange,
  transaction,
  onStatusChange
}) => {
  const {
    step, // 'agreement', 'payment', 'success', 'error'
    payNow,
    isLoading,
    error,
    reset,
    paymentStatus,
  } = useEscrowPayment({
    transaction,
    onStatusChange,
    onClose: () => onOpenChange(false)
  });

  // Agreement details shown before payment
  const AgreementStep = (
    <>
      <DialogHeader>
        <DialogTitle>Review Escrow Agreement</DialogTitle>
        <DialogDescription>
          Please review the escrow transaction agreement before proceeding with the payment.
        </DialogDescription>
      </DialogHeader>
      <div className="my-4 p-4 bg-gray-50 rounded">
        <p>
          <strong>Description:</strong> {transaction.description}
        </p>
        <p>
          <strong>Timeline:</strong> {transaction.timeline || "30 days"}
        </p>
        <div className="mt-2">
          <strong>Amount:</strong> ${transaction.amount.toFixed(2)}
        </div>
        <div>
          <strong>Platform Fee:</strong> ${transaction.platform_fee?.toFixed(2) || "0.00"}
        </div>
        <div>
          <strong>Escrow Fee:</strong> ${transaction.escrow_fee?.toFixed(2) || "0.00"}
        </div>
        <div className="mt-1">
          <strong>Total Due:</strong>{" "}
          ${(transaction.amount + (transaction.platform_fee || 0) + (transaction.escrow_fee || 0)).toFixed(2)}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          By proceeding you agree to these terms and authorize payment into escrow.
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={payNow} className="w-[180px]" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Processing…</span>
          ) : (
            "Pay & Start Escrow"
          )}
        </Button>
      </DialogFooter>
    </>
  );

  // Payment in progress or error message
  const PaymentStep = (
    <>
      <DialogHeader>
        <DialogTitle>Processing Payment…</DialogTitle>
      </DialogHeader>
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled>
          Cancel
        </Button>
      </DialogFooter>
    </>
  );

  const SuccessStep = (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Payment Successful!
        </DialogTitle>
        <DialogDescription>
          The escrow payment has been secured. Both you and the seller will be notified.
        </DialogDescription>
      </DialogHeader>
      <div className="my-4 p-4 bg-green-50 rounded">
        <p>Thank you! Your funds are now held in escrow. The seller will proceed with delivery.</p>
      </div>
      <DialogFooter>
        <Button onClick={() => { reset(); onOpenChange(false); }}>Close</Button>
      </DialogFooter>
    </>
  );

  const ErrorStep = (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5 text-red-600" />
          Payment Failed
        </DialogTitle>
        <DialogDescription>
          There was an error while processing your payment. Please try again.
        </DialogDescription>
      </DialogHeader>
      <Alert variant="destructive" className="my-4">
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
      <DialogFooter>
        <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }}>Close</Button>
        <Button onClick={payNow}>Try Again</Button>
      </DialogFooter>
    </>
  );

  let content = null;
  if (step === "agreement") content = AgreementStep;
  else if (step === "payment") content = PaymentStep;
  else if (step === "success") content = SuccessStep;
  else if (step === "error") content = ErrorStep;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">{content}</DialogContent>
    </Dialog>
  );
};
