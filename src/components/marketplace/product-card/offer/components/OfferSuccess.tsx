
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface OfferSuccessProps {
  onClose: () => void;
}

export function OfferSuccess({ onClose }: OfferSuccessProps) {
  return (
    <div className="py-8">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-green-100 p-3 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-medium mb-2">Offer Initiated!</h3>
        <p className="text-gray-600 mb-6 max-w-md">
          Your deposit has been initiated. Once confirmed, your offer will be submitted to the seller.
        </p>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
