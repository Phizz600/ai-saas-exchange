import { Card } from "@/components/ui/card";
import { StoreIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductOffers, updateOfferStatus } from "@/integrations/supabase/products";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { OfferCard } from "./offer-cards/OfferCard";
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
        {[1, 2, 3].map(i => <Card key={i} className="p-6">
            <div className="animate-pulse flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </Card>)}
      </div>;
  }
  if (!offers.length) {
    return <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <StoreIcon className="h-12 w-12 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold mb-2">No Offers Yet</h3>
            <p className="text-gray-600 mb-4">
              When you receive offers from buyers, they'll appear here.
            </p>
            <Button asChild variant="green">
              <Link to="/list-product">Sell My AI SaaS</Link>
            </Button>
          </div>
        </div>
      </Card>;
  }
  return <div className="space-y-4">
      {offers.map(offer => <OfferCard key={offer.id} offer={offer} onUpdateStatus={(offerId, status) => updateStatus({
      offerId,
      status
    })} />)}
    </div>;
};