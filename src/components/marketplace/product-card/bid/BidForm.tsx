
import { useState, useEffect } from "react";
import { useBidForm } from "./hooks/useBidForm";
import { useBidRealtime } from "./hooks/useBidRealtime";
import { useBidValidation } from "./hooks/useBidValidation";
import { BidErrorAlert } from "./components/BidErrorAlert";
import { PaymentErrorAlert } from "./components/PaymentErrorAlert";
import { BidSuccessMessage } from "./components/BidSuccessMessage";
import { BidInputForm } from "./components/BidInputForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface BidFormProps {
  productId: string;
  productTitle: string;
  currentPrice?: number;
}

export function BidForm({ productId, productTitle, currentPrice }: BidFormProps) {
  const [bidCancelled, setBidCancelled] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  
  const { highestBid, isLoadingBids, fetchError } = useBidRealtime(productId);
  
  const { bidError: validationError, validateBid, clearBidError } = useBidValidation({
    currentPrice,
    highestBid,
    onValidationError: (error) => setBidError(error)
  });

  const {
    bidAmount,
    formattedBidAmount,
    isSubmitting,
    success,
    paymentError,
    handleAmountChange,
    handleInitiateBid,
    resetForm
  } = useBidForm({
    productId,
    productTitle,
    currentPrice: highestBid || currentPrice,
    onValidationError: (error) => setBidError(error)
  });

  const validateAndBid = () => {
    clearBidError();
    setBidError(null);
    setBidCancelled(false);
    
    if (validateBid(bidAmount)) {
      console.log("Bid validation passed, proceeding with bid:", bidAmount);
      handleInitiateBid();
    }
  };

  if (success) {
    return <BidSuccessMessage resetForm={resetForm} />;
  }

  if (fetchError) {
    return (
      <Alert variant="destructive" className="mb-3">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          {fetchError}
          <div className="mt-2">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-white text-destructive px-4 py-2 rounded font-medium hover:bg-gray-100"
            >
              Refresh Page
            </button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const displayPrice = highestBid || currentPrice;

  return (
    <>
      <BidErrorAlert bidError={bidError || validationError} />
      <PaymentErrorAlert paymentError={paymentError} />
      
      {bidCancelled && (
        <Alert variant="destructive" className="mb-3">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>Bid cancelled. Your payment was not processed.</AlertDescription>
        </Alert>
      )}
      
      <BidInputForm 
        bidAmount={bidAmount}
        handleAmountChange={handleAmountChange}
        isLoadingBids={isLoadingBids}
        highestBid={highestBid}
        currentPrice={currentPrice}
        isSubmitting={isSubmitting}
        validateAndBid={validateAndBid}
        clearBidError={clearBidError}
      />
    </>
  );
}
