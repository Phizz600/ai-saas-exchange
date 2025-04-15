
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface OfferSuccessProps {
  onClose: () => void;
  isUpdatingOffer?: boolean;
}

export function OfferSuccess({ onClose, isUpdatingOffer = false }: OfferSuccessProps) {
  return (
    <div className="py-8">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-green-100 p-3 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-medium mb-2">
          {isUpdatingOffer ? "Offer Updated!" : "Offer Submitted!"}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          {isUpdatingOffer 
            ? "Your offer has been updated successfully and sent to the seller."
            : "Your offer has been submitted to the seller for review. You'll be notified when they respond."}
        </p>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
