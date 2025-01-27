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
            stage
          )
        `)
        .eq('bidder_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching active bids:', error);
        throw error;
      }

      return data;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {activeBids.map((bid) => (
        <Link to={`/product/${bid.product.id}`} key={bid.id}>
          <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="aspect-video relative mb-3">
              {bid.product.image_url ? (
                <img
                  src={bid.product.image_url}
                  alt={bid.product.title}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <h3 className="font-medium text-sm mb-1">{bid.product.title}</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Your bid: {formatCurrency(bid.amount)}</span>
              <span className="text-xs text-gray-500">Current: {formatCurrency(bid.product.price)}</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};