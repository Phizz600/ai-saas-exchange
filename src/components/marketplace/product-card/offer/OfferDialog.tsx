
import { useState } from "react";
import { OfferSuccess } from "./components/OfferSuccess";
import { OfferForm } from "./components/OfferForm";
import { useOfferForm } from "./hooks/useOfferForm";

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
  const {
    amount,
    message,
    isSubmitting,
    success,
    formattedAmount,
    existingOffer,
    isUpdatingOffer,
    setMessage,
    handleAmountChange,
    handleInitiateOffer
  } = useOfferForm({ productId, isAuction, currentPrice });

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  
  return (
    <>
      <div className="space-y-4">
        <div className="text-center mb-2">
          <h2 className="text-xl font-semibold exo-2-title">
            {isUpdatingOffer ? "Update Your Offer" : "Make an Offer"}
          </h2>
          <p className="text-sm text-gray-500">
            {productTitle}
          </p>
        </div>
        
        {success ? (
          <OfferSuccess onClose={onClose} isUpdatingOffer={isUpdatingOffer} />
        ) : (
          <OfferForm
            amount={amount}
            message={message}
            formattedAmount={formattedAmount}
            isSubmitting={isSubmitting}
            productId={productId}
            onAmountChange={handleAmountChange}
            onMessageChange={handleMessageChange}
            onInitiateOffer={handleInitiateOffer}
            existingOffer={existingOffer}
            isUpdatingOffer={isUpdatingOffer}
          />
        )}
      </div>
    </>
  );
}
