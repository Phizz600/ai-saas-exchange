
import { useState, useEffect } from "react";
import { Timer, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  };
}

export function ProductPricing({ product }: ProductPricingProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [nextDrop, setNextDrop] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch recent bids
  const { data: recentBids } = useQuery({
    queryKey: ['recent-bids', product.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('product_id', product.id)
        .gte('created_at', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [product.auction_end_time, product.price_decrement_interval]);

  const handleBid = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to place a bid",
          variant: "destructive"
        });
        return;
      }

      const bidValue = parseFloat(bidAmount);
      if (isNaN(bidValue) || bidValue < (product.current_price || 0)) {
        toast({
          title: "Invalid bid amount",
          description: "Bid must be greater than or equal to the current price",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('bids')
        .insert({
          product_id: product.id,
          bidder_id: user.id,
          amount: bidValue,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Bid placed successfully!",
        description: `You've placed a bid for $${bidValue.toLocaleString()}`,
      });
      setBidAmount("");

    } catch (error) {
      console.error('Error placing bid:', error);
      toast({
        title: "Error placing bid",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Current Price</p>
              <p className="text-3xl font-bold">
                ${(product.current_price || product.price || 0).toLocaleString()}
              </p>
              {product.min_price && (
                <p className="text-sm text-gray-600 mt-1">
                  Min Price: ${product.min_price.toLocaleString()}
                </p>
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

          {recentBids && (
            <div className="text-sm text-gray-600">
              {recentBids.length > 0 ? (
                <p>{recentBids.length} bid{recentBids.length !== 1 ? 's' : ''} placed in the last 12h</p>
              ) : (
                <p>No bids in the last 12h</p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount"
              min={product.current_price || product.price || 0}
              step="0.01"
            />
            <Button 
              className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90"
              onClick={handleBid}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Placing bid..." : "Place Bid"}
            </Button>
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
