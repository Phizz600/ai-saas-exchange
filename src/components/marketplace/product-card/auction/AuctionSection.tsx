
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
    auction_end_time?: string;
    highest_bid?: number;
  };
}

export function AuctionSection({ product }: AuctionSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(product.highest_bid || product.current_price);
  const [highestBid, setHighestBid] = useState(product.highest_bid);
  const [showBidForm, setShowBidForm] = useState(false);
  const { toast } = useToast();
  const auctionEnded = product.auction_end_time && new Date(product.auction_end_time) < new Date();

  // Subscribe to real-time product updates
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
          // Only update if highest_bid exists and is from an authorized bid
          if (payload.new.highest_bid) {
            setCurrentPrice(payload.new.highest_bid);
            setHighestBid(payload.new.highest_bid);
          } else {
            // Fall back to current_price if no authorized highest bid
            setCurrentPrice(payload.new.current_price);
            setHighestBid(null);
          }
        }
      )
      .subscribe();

    // Also subscribe to bid updates to catch bid cancellations
    const bidChannel = supabase
      .channel('bid-status-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bids',
          filter: `product_id=eq.${product.id}`
        },
        async (payload: any) => {
          // If a bid is cancelled or payment fails, we need to check for the new highest bid
          if (payload.new.status === 'cancelled' || payload.new.payment_status === 'cancelled') {
            console.log('Bid cancelled or payment failed, refreshing highest bid');
            
            // Fetch the new highest authorized bid
            const { data: highestBidData } = await supabase
              .from('bids')
              .select('amount')
              .eq('product_id', product.id)
              .eq('payment_status', 'authorized')
              .eq('status', 'active')
              .order('amount', { ascending: false })
              .limit(1)
              .single();
            
            if (highestBidData) {
              console.log('New highest authorized bid:', highestBidData.amount);
              setHighestBid(highestBidData.amount);
              setCurrentPrice(highestBidData.amount);
            } else {
              console.log('No authorized bids found after cancellation');
              // If there are no authorized bids, fall back to the system-calculated price
              const { data: productData } = await supabase
                .from('products')
                .select('current_price')
                .eq('id', product.id)
                .single();
                
              if (productData) {
                console.log('Setting to system current price:', productData.current_price);
                setCurrentPrice(productData.current_price);
                setHighestBid(null);
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(bidChannel);
    };
  }, [product.id]);

  // Initialize with the highest bid if available
  useEffect(() => {
    // Always prioritize product.highest_bid because it comes from authorized bids only
    setCurrentPrice(product.highest_bid || product.current_price);
    setHighestBid(product.highest_bid);
  }, [product.highest_bid, product.current_price]);

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

  // Calculate the display price - always use the highest bid if available
  const displayPrice = highestBid || currentPrice;

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
            ${displayPrice?.toLocaleString()}
          </div>
          {highestBid && (
            <div className="text-xs text-emerald-600 font-medium">
              Current price set by highest bid
            </div>
          )}
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
          <span>24h left</span>
        </div>
        <div className="flex items-center gap-2 text-amber-600">
          <TrendingDown className="h-4 w-4" />
          <span>Drops ${product.price_decrement?.toLocaleString()}/hour</span>
        </div>
      </div>

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
            currentPrice={displayPrice}
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
