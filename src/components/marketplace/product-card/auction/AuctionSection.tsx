
import { Timer, TrendingDown, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BidForm } from "../bid/BidForm";

interface AuctionSectionProps {
  product: {
    id: string;
    title?: string;
    current_price?: number;
    min_price?: number;
    price_decrement?: number;
    price_decrement_interval?: string;
    auction_end_time?: string;
  };
}

export function AuctionSection({ product }: AuctionSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(product.current_price);
  const [showBidForm, setShowBidForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [nextDrop, setNextDrop] = useState("");
  const { toast } = useToast();
  const auctionEnded = product.auction_end_time && new Date(product.auction_end_time) < new Date();

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
          if (payload.new.current_price !== currentPrice) {
            setCurrentPrice(payload.new.current_price);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [product.id]);

  // Calculate the interval in milliseconds
  const getIntervalInMilliseconds = () => {
    const interval = product.price_decrement_interval || 'day';
    switch(interval) {
      case 'minute': return 60 * 1000;
      case 'hour': return 60 * 60 * 1000;
      case 'day': return 24 * 60 * 60 * 1000;
      case 'week': return 7 * 24 * 60 * 60 * 1000;
      case 'month': return 30 * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000;
    }
  };

  // Format the price decrement to show the correct interval
  const formatPriceDecrement = () => {
    if (!product.price_decrement) return "";
    
    const interval = product.price_decrement_interval || 'day';
    return `$${product.price_decrement.toLocaleString()}/${interval}`;
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!product.auction_end_time) return;

      const now = new Date().getTime();
      const endTime = new Date(product.auction_end_time).getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft('Auction ended');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);

      // Calculate next price drop
      const interval = getIntervalInMilliseconds();
      const nextDropTime = Math.ceil(now / interval) * interval;
      const timeToNextDrop = nextDropTime - now;
      
      // Format the next drop time
      const nextDropHours = Math.floor(timeToNextDrop / (1000 * 60 * 60));
      const nextDropMinutes = Math.floor((timeToNextDrop % (1000 * 60 * 60)) / (1000 * 60));
      
      if (nextDropHours > 0) {
        setNextDrop(`${nextDropHours}h ${nextDropMinutes}m`);
      } else {
        setNextDrop(`${nextDropMinutes}m`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [product.auction_end_time]);

  const handleShare = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Product link has been copied to clipboard",
      });
      setIsShareOpen(false);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Error",
        description: "Could not copy the link. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-purple-900">Dutch Auction</span>
        </div>
        <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Share className="h-4 w-4 text-gray-500" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share this product</DialogTitle>
            </DialogHeader>
            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <Input 
                  readOnly 
                  value={window.location.href} 
                  className="bg-gray-50"
                />
                <Button 
                  onClick={() => handleShare(window.location.href)}
                >
                  Copy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-sm font-semibold text-gray-600">Current Price</span>
          <div className="text-lg font-bold text-purple-600">
            ${currentPrice?.toLocaleString()}
          </div>
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-600">Min Price</span>
          <div className="font-medium text-gray-900">
            ${product.min_price?.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Timer className="h-4 w-4" />
          <span>{timeLeft}</span>
        </div>
        <div className="flex items-center gap-2 text-amber-600">
          <TrendingDown className="h-4 w-4" />
          <span>Drops {formatPriceDecrement()}</span>
        </div>
      </div>

      <div className="text-sm text-amber-600 mb-4">Next drop in: {nextDrop}</div>

      {!auctionEnded && !showBidForm && (
        <Button 
          className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white hover:opacity-90"
          onClick={() => setShowBidForm(true)}
        >
          Place Bid
        </Button>
      )}

      {showBidForm && (
        <div className="border-t pt-4 mt-2">
          <BidForm
            productId={product.id}
            productTitle={product.title || "Product"}
            currentPrice={currentPrice}
          />
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 w-full text-xs"
            onClick={() => setShowBidForm(false)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
