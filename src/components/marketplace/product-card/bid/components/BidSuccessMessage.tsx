
import { Button } from "@/components/ui/button";

interface BidSuccessMessageProps {
  resetForm: () => void;
}

export function BidSuccessMessage({ resetForm }: BidSuccessMessageProps) {
  return (
    <div className="space-y-4 bg-green-50 p-4 rounded-md">
      <h3 className="font-medium text-green-800">Bid Successfully Submitted!</h3>
      <p className="text-sm text-green-700">
        Your bid has been received and your payment method has been authorized. No charges have been made to your card yet - you'll only be charged if you win this auction.
      </p>
      <Button
        onClick={resetForm}
        variant="outline"
        size="sm"
      >
        Place Another Bid
      </Button>
    </div>
  );
}
