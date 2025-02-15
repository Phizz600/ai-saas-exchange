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
    highest_bid?: number;
    starting_price?: number;
  };
}

export function ProductPricing({ product }: ProductPricingProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [nextDrop, setNextDrop] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(product.current_price);
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
          setCurrentPrice(payload.new.current_price);
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
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [product.auction_end_time, product.price_decrement_interval]);

  const formatCurrencyInput = (value: string) => {
    let numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts.length === 2 && parts[1].length > 2) {
      numericValue = parts[0] + '.' + parts[1].slice(0, 2);
    }
    if (numericValue) {
      const number = parseFloat(numericValue);
      if (!isNaN(number)) {
        return `$${number.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        })}`;
      }
    }
    return '';
  };

  const parseCurrencyValue = (value: string) => {
    return parseFloat(value.replace(/[$,]/g, '')) || 0;
  };

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

      const bidValue = parseCurrencyValue(bidAmount);
      const currentHighestBid = currentPrice || product.starting_price || product.price || 0;

      if (isNaN(bidValue) || bidValue <= currentHighestBid) {
        toast({
          title: "Invalid bid amount",
          description: `Bid must be greater than the current price of $${currentHighestBid.toLocaleString()}`,
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

  const handleOffer = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to make an offer",
          variant: "destructive"
        });
        return;
      }

      const amount = parseCurrencyValue(offerAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid offer amount",
          description: "Please enter a valid offer amount",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('offers')
        .insert({
          product_id: product.id,
          bidder_id: user.id,
          amount,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Offer submitted successfully!",
        description: `You've made an offer for $${amount.toLocaleString()}`,
      });
      setOfferAmount("");

    } catch (error) {
      console.error('Error making offer:', error);
      toast({
        title: "Error submitting offer",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine the current price to display
  const displayPrice = currentPrice || product.starting_price || product.price || 0;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Current Price</p>
              <p className="text-3xl font-bold">
                ${displayPrice.toLocaleString()}
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
            <div className="space-y-3">
              <Input
                type="text"
                value={bidAmount}
                onChange={(e) => setBidAmount(formatCurrencyInput(e.target.value))}
                placeholder="Enter bid amount"
                className="font-mono"
              />
              <Button 
                className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90"
                onClick={handleBid}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing bid..." : "Place Bid"}
              </Button>
            </div>
          )}

          <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
            <Input
              type="text"
              value={offerAmount}
              onChange={(e) => setOfferAmount(formatCurrencyInput(e.target.value))}
              placeholder="Enter offer amount"
              className="font-mono"
            />
            <Button 
              variant="outline"
              className="w-full border-2 hover:bg-gray-50"
              onClick={handleOffer}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Make an Offer"}
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
