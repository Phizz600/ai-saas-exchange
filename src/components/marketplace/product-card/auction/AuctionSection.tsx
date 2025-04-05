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
    starting_price?: number;
    min_price?: number;
    price_decrement?: number;
    auction_end_time?: string;
    highest_bid?: number;
  };
}

export function AuctionSection({ product }: AuctionSectionProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | undefined>(undefined);
  const [highestBid, setHighestBid] = useState<number | undefined>(product.highest_bid);
  const [showBidForm, setShowBidForm] = useState(false);
  const { toast } = useToast();
  const auctionEnded = product.auction_end_time && new Date(product.auction_end_time) < new Date();

  // Use starting_price as fallback if neither highest_bid nor current_price is available
  const startingPrice = product.starting_price;

  // Subscribe to real-time product updates
  useEffect(() => {
    // First, get the current state of the product to initialize correctly
    const fetchCurrentProductState = async () => {
      try {
        // Get the product's current state including highest_bid and current_price
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('highest_bid, current_price, starting_price')
          .eq('id', product.id)
          .single();
          
        if (productError) {
          console.error('Error fetching product data:', productError);
          return;
        }
        
        // If highest_bid exists, it means there's an authorized bid
        if (productData.highest_bid) {
          setHighestBid(productData.highest_bid);
          setCurrentPrice(productData.highest_bid);
        } else {
          // No authorized highest bid, use system-calculated price or starting price
          setHighestBid(undefined);
          setCurrentPrice(productData.current_price || productData.starting_price);
        }
      } catch (error) {
        console.error('Error in fetchCurrentProductState:', error);
      }
    };
    
    fetchCurrentProductState();
    
    // Subscribe to product updates in real-time
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
          
          // If we have a highest_bid from an authorized bid, use that
          if (payload.new.highest_bid) {
            setHighestBid(payload.new.highest_bid);
            setCurrentPrice(payload.new.highest_bid);
          } else {
            // Otherwise use the system-calculated current_price or starting price
            setHighestBid(undefined);
            setCurrentPrice(payload.new.current_price || payload.new.starting_price);
          }
        }
      )
      .subscribe();

    // Also subscribe to bid updates to catch status changes
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
          // If a bid status changes (especially cancellations), check product state
          console.log('Bid updated:', payload);
          if (payload.new.status === 'cancelled' || payload.new.payment_status === 'cancelled') {
            console.log('Detected bid cancellation, refreshing product state');
            await fetchCurrentProductState();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(bidChannel);
    };
  }, [product.id]);

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

  // Calculate the display price - prioritize highest bid if available
  const displayPrice = highestBid || currentPrice || startingPrice;

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
