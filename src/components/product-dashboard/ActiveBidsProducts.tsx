
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";

export const ActiveBidsProducts = () => {
  const { data: activeBids, isLoading } = useQuery({
    queryKey: ['active-bids'],
    queryFn: async () => {
      console.log('Fetching active bids');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('bids')
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
        console.error('Error fetching active bids:', error);
        throw error;
      }

      // Group bids by product and get the most recent bid for each
      const latestBidsByProduct = data.reduce((acc: any, bid: any) => {
        if (!acc[bid.product.id] || new Date(bid.created_at) > new Date(acc[bid.product.id].created_at)) {
          acc[bid.product.id] = bid;
        }
        return acc;
      }, {});

      return Object.values(latestBidsByProduct);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!activeBids?.length) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No active bids at the moment
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeBids.map((bid: any) => (
        <Link to={`/product/${bid.product.id}`} key={bid.id}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              {bid.product.image_url ? (
                <img
                  src={bid.product.image_url}
                  alt={bid.product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-4">{bid.product.title}</h3>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-sm text-gray-500">Your bid:</span>
                  <span className="text-lg font-bold ml-2 text-purple-600">
                    {formatCurrency(bid.amount)}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Current:</span>
                  <span className="text-base ml-2 text-gray-700">
                    {formatCurrency(bid.product.current_price)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};
