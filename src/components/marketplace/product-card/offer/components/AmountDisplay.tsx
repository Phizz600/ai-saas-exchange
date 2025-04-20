
import { Card } from "@/components/ui/card";

interface AmountDisplayProps {
  productTitle: string;
  offerAmount: number;
}

export function AmountDisplay({ productTitle, offerAmount }: AmountDisplayProps) {
  const formattedOfferAmount = offerAmount ? offerAmount.toLocaleString() : "0";

  return (
    <div className="mb-4 bg-gray-50 p-3 rounded-md">
      <p className="text-sm text-gray-700">
        <span className="font-medium">Product:</span> {productTitle}
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-medium">Offer Amount:</span> ${formattedOfferAmount}
      </p>
    </div>
  );
}
