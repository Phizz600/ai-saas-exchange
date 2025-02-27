import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, StoreIcon } from "lucide-react";
import { getProductOffers, updateOfferStatus } from "@/integrations/supabase/functions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
export const ProductOffers = () => {
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const {
    data: offers = [],
    isLoading
  } = useQuery({
    queryKey: ['product-offers'],
    queryFn: getProductOffers
  });
  const {
    mutate: updateStatus
  } = useMutation({
    mutationFn: ({
      offerId,
      status
    }: {
      offerId: string;
      status: 'accepted' | 'declined';
    }) => updateOfferStatus(offerId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['product-offers']
      });
      toast({
        title: "Offer updated",
        description: "The offer status has been updated successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update offer status. Please try again.",
        variant: "destructive"
      });
    }
  });
  if (isLoading) {
    return <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>)}
      </div>;
  }
  if (!offers.length) {
    return <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <StoreIcon className="h-12 w-12 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold mb-2">No Offers Yet</h3>
            <p className="text-gray-600 mb-4">
              When you list products and receive offers from buyers, they'll appear here.
            </p>
            <Button asChild>
              
            </Button>
          </div>
        </div>
      </Card>;
  }
  return <div className="space-y-4">
      {offers.map(offer => <Card key={offer.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={offer.products?.image_url || "/placeholder.svg"} alt={offer.products?.title} className="w-16 h-16 object-cover rounded-lg" />
              <div>
                <h3 className="font-semibold">{offer.products?.title}</h3>
                <p className="text-sm text-gray-600">
                  Offer from {offer.bidder?.full_name || "Anonymous"}
                </p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(offer.amount)}
                </p>
                {offer.message && <p className="text-sm text-gray-600 mt-1">{offer.message}</p>}
              </div>
            </div>
            
            {offer.status === 'pending' ? <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => updateStatus({
            offerId: offer.id,
            status: 'declined'
          })}>
                  <X className="h-4 w-4 mr-1" />
                  Decline
                </Button>
                <Button size="sm" className="text-white bg-green-600 hover:bg-green-700" onClick={() => updateStatus({
            offerId: offer.id,
            status: 'accepted'
          })}>
                  <Check className="h-4 w-4 mr-1" />
                  Accept
                </Button>
              </div> : <span className={`px-3 py-1 rounded-full text-sm ${offer.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
              </span>}
          </div>
        </Card>)}
    </div>;
};