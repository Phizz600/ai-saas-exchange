import { useState, useEffect } from "react";
import { Timer, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OfferDialog } from "@/components/marketplace/product-card/offer/OfferDialog";
import { BidForm } from "@/components/marketplace/product-card/bid/BidForm";

interface ProductPricingProps {
  product: {
    id: string;
    current_price?: number;
    price?: number;
    auction_end_time?: string;
    price_decrement?: number;
    price_decrement_interval?: string;
    min_price?: number;
    demo_url?: string;
    highest_bid?: number;
    starting_price?: number;
    title?: string;
  };
}

export function ProductPricing({ product }: ProductPricingProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [nextDrop, setNextDrop] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(product.highest_bid || product.current_price);
  const [highestBid, setHighestBid] = useState(product.highest_bid);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const { toast } = useToast();

  // Subscribe to real-time price updates
  useEffect(() => {
    const channel = supabase
      .channel('product-price-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `id=eq.${product.id}`
        },
        (payload: any) => {
          console.log('Product updated:', payload);
          // Always prioritize highest_bid for current price if it exists
          setCurrentPrice(payload.new.highest_bid || payload.new.current_price);
          setHighestBid(payload.new.highest_bid);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [product.id]);

  // Fetch recent bids with bidder information
  const { data: recentBids, refetch: refetchBids } = useQuery({
    queryKey: ['recent-bids', product.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          bidder:profiles!bids_bidder_id_fkey(full_name)
        `)
        .eq('product_id', product.id)
        .gte('created_at', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const formatBidderName = (fullName: string | null) => {
    if (!fullName) return "Anonymous";
    const initial = fullName.charAt(0).toUpperCase();
    return `${initial}${'*'.repeat(6)}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!product.auction_end_time) return;

      const now = new Date().getTime();
      const endTime = new Date(product.auction_end_time).getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft("Auction ended");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);

      // Calculate next price drop
      const interval = product.price_decrement_interval === 'hour' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      const nextDropTime = Math.ceil(now / interval) * interval;
      const timeToNextDrop = nextDropTime - now;
      const nextDropHours = Math.floor(timeToNextDrop / (1000 * 60 * 60));
      const nextDropMinutes = Math.floor((timeToNextDrop % (1000 * 60 * 60)) / (1000 * 60));
      setNextDrop(`${nextDropHours}h ${nextDropMinutes}m`);
    };

    calculateTimeLeft();

    // Update the initial current price based on highest bid if available
    setCurrentPrice(product.highest_bid || product.current_price);
  }, [product.auction_end_time, product.price_decrement_interval, product.highest_bid, product.current_price]);

  // Determine the price information to display
  const isAuction = !!product.auction_end_time;
  // Always use highest bid as the displayed price if available
  const displayPrice = highestBid || currentPrice || product.price || 0;
  const hasActiveBids = !!highestBid;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                {isAuction ? "Current Price" : "Price"}
              </p>
              <p className="text-3xl font-bold">
                ${displayPrice.toLocaleString()}
              </p>
              {isAuction && (
                <>
                  {hasActiveBids && (
                    <p className="text-sm text-emerald-600 font-medium">
                      Current price set by highest bid
                    </p>
                  )}
                  {product.min_price && (
                    <p className="text-sm text-gray-600 mt-1">
                      Min Price: ${product.min_price.toLocaleString()}
                    </p>
                  )}
                </>
              )}
            </div>
            {product.auction_end_time && (
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Timer className="h-4 w-4" />
                  <span>{timeLeft}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingDown className="h-4 w-4" />
                  <span>
                    Drops ${product.price_decrement?.toLocaleString()}/{product.price_decrement_interval || 'day'}
                  </span>
                </div>
                <p className="text-sm text-amber-600 mt-1">Next drop in: {nextDrop}</p>
              </div>
            )}
          </div>

          {isAuction && (
            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 mt-3">
              <p>
                <span className="font-medium">How Dutch Auctions Work:</span> The price starts high and 
                decreases over time until someone places a bid. The highest bid always sets the current price.
              </p>
            </div>
          )}

          {recentBids && recentBids.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <p>{recentBids.length} bid{recentBids.length !== 1 ? 's' : ''} placed in the last 12h</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">
                  Last bid placed by: <span className="font-medium">{formatBidderName(recentBids[0].bidder?.full_name)}</span>
                  <br />
                  <span className="text-gray-500">
                    ${recentBids[0].amount.toLocaleString()} • {formatTimeAgo(recentBids[0].created_at)}
                  </span>
                </p>
              </div>
            </div>
          )}
          
          {product.auction_end_time && (
            <div className="space-y-3 border p-4 rounded-md">
              <h3 className="font-medium">Place Your Bid</h3>
              <BidForm 
                productId={product.id}
                productTitle={product.title || "Product"} 
                currentPrice={displayPrice}
              />
            </div>
          )}

          <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
            <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="w-full border-2 hover:bg-gray-50"
                >
                  Make an Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <OfferDialog 
                  productId={product.id}
                  productTitle={product.title || "Product"}
                  isAuction={!!product.auction_end_time}
                  currentPrice={displayPrice}
                  onClose={() => setOfferDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {product.demo_url && (
          <a 
            href={product.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline mt-4"
          >
            View Live Demo
          </a>
        )}
      </div>
    </Card>
  );
}
