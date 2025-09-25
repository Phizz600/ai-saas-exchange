import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";

export const ActiveOffersProducts = () => {
  const { data: activeOffers, isLoading } = useQuery({
    queryKey: ['active-offers'],
    queryFn: async () => {
      console.log('Fetching active offers');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          product:products (
            id,
            title,
            price,
            image_url,
            category,
            stage,
            current_price
          )
        `)
        .eq('bidder_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching active offers:', error);
        throw error;
      }

      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!activeOffers?.length) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No active offers at the moment
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeOffers.map((offer: any) => (
        <Link to={`/product/${offer.product.id}`} key={offer.id}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              {offer.product.image_url ? (
                <img
                  src={offer.product.image_url}
                  alt={offer.product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-4">{offer.product.title}</h3>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-sm text-gray-500">Your offer:</span>
                  <span className="text-lg font-bold ml-2 text-purple-600">
                    {formatCurrency(offer.amount)}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Listed at:</span>
                  <span className="text-base ml-2 text-gray-700">
                    {formatCurrency(offer.product.price)}
                  </span>
                </div>
              </div>
              {offer.message && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Message:</span>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">{offer.message}</p>
                </div>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};