
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface OfferSuccessProps {
  onClose: () => void;
  isUpdatingOffer?: boolean;
}

export function OfferSuccess({ onClose, isUpdatingOffer = false }: OfferSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="bg-green-100 p-3 rounded-full mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2 exo-2-header">
        {isUpdatingOffer ? "Offer Updated!" : "Offer Submitted!"}
      </h3>
      
      <p className="text-gray-600 mb-6">
        {isUpdatingOffer 
          ? "Your offer has been successfully updated." 
          : "Your offer has been submitted and your payment method has been authorized. The seller will be notified."
        }
      </p>
      
      <Button 
        onClick={onClose} 
        className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90"
      >
        Close
      </Button>
    </div>
  );
}
