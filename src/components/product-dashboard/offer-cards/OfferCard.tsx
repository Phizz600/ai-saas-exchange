
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface OfferCardProps {
  offer: {
    id: string;
    amount: number;
    message?: string | null;
    status: string;
    bidder?: {
      full_name: string | null;
    };
    products?: {
      title: string;
      image_url: string | null;
    };
  };
  onUpdateStatus: (offerId: string, status: 'accepted' | 'declined') => void;
}

export const OfferCard = ({ offer, onUpdateStatus }: OfferCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img 
            src={offer.products?.image_url || "/placeholder.svg"} 
            alt={offer.products?.title} 
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="space-y-1">
            <h3 className="font-medium line-clamp-1">{offer.products?.title}</h3>
            <p className="text-sm text-gray-600">
              Offer from {offer.bidder?.full_name || "Anonymous"}
            </p>
            <p className="text-lg font-semibold text-green-600">
              ${offer.amount.toLocaleString()}
            </p>
            {offer.message && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{offer.message}</p>
            )}
          </div>
        </div>
        
        {offer.status === 'pending' ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-600 hover:text-red-700" 
              onClick={() => onUpdateStatus(offer.id, 'declined')}
            >
              <X className="h-4 w-4 mr-1" />
              Decline
            </Button>
            <Button 
              size="sm" 
              className="text-white bg-green-600 hover:bg-green-700"
              onClick={() => onUpdateStatus(offer.id, 'accepted')}
            >
              <Check className="h-4 w-4 mr-1" />
              Accept
            </Button>
          </div>
        ) : (
          <span className={`px-3 py-1 rounded-full text-sm ${
            offer.status === 'accepted' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
          </span>
        )}
      </div>
    </Card>
  );
};
