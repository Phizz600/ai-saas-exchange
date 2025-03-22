
import { useState } from "react";
import { DepositConfirmDialog } from "./DepositConfirmDialog";
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
    depositDialogOpen,
    formattedAmount,
    setMessage,
    setDepositDialogOpen,
    handleAmountChange,
    handleInitiateOffer,
    handleOfferSubmit
  } = useOfferForm({ productId, isAuction, currentPrice });

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  
  return (
    <>
      <div className="space-y-4">
        <div className="text-center mb-2">
          <h2 className="text-xl font-semibold exo-2-title">Make an Offer</h2>
          <p className="text-sm text-gray-500">
            {productTitle}
          </p>
        </div>
        
        {success ? (
          <OfferSuccess onClose={onClose} />
        ) : (
          <OfferForm
            amount={amount}
            message={message}
            formattedAmount={formattedAmount}
            isSubmitting={isSubmitting}
            onAmountChange={handleAmountChange}
            onMessageChange={handleMessageChange}
            onInitiateOffer={handleInitiateOffer}
          />
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
