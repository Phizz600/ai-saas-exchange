import { useState, useEffect } from "react";
import { Timer, TrendingDown, ChevronDown, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OfferDialog } from "@/components/marketplace/product-card/offer/OfferDialog";
import { BidForm } from "@/components/marketplace/product-card/bid/BidForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { sendAuctionResultEmail } from "@/integrations/supabase/functions";

interface ProductPricingProps {
  product: {
    id: string;
    current_price?: number;
    price?: number;
    auction_end_time?: string;
    price_decrement?: number;
    price_decrement_interval?: string;
    reserve_price?: number; // Changed from min_price
    demo_url?: string;
    highest_bid?: number;
    highest_bidder_id?: string;
    starting_price?: number;
    title?: string;
    status?: string;
    no_reserve?: boolean; // Added no_reserve field
  };
}

interface Bid {
  id: string;
  amount: number;
  created_at: string;
  payment_status: string;
  status: string;
  bidder: {
    full_name: string | null;
  };
}

export function ProductPricing({
  product
}: ProductPricingProps) {
  // Initialize price with current_price or starting_price to avoid flashing
  const initialPrice = product.highest_bid || product.current_price || product.starting_price || 0;
  const [timeLeft, setTimeLeft] = useState("");
  const [nextDrop, setNextDrop] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number>(initialPrice);
  const [highestBid, setHighestBid] = useState<number | null>(product.highest_bid || null);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [bidHistoryDialogOpen, setBidHistoryDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const {
    toast
  } = useToast();

  // Function to fetch and verify the highest bid
  const fetchHighestBid = async () => {
    try {
      setIsLoading(true);
      // Get the latest product data
      const {
        data: productData,
        error: productError
      } = await supabase.from('products').select('highest_bid, highest_bidder_id, current_price, starting_price').eq('id', product.id).single();
      if (productError) {
        console.error('Error fetching product:', productError);
        return;
      }
      if (productData.highest_bid && productData.highest_bidder_id) {
        // Verify that the highest bid is still valid
        const {
          data: validBid,
          error: bidError
        } = await supabase.from('bids').select('amount').eq('product_id', product.id).eq('bidder_id', productData.highest_bidder_id).eq('amount', productData.highest_bid).eq('status', 'active').eq('payment_status', 'authorized').single();
        if (bidError || !validBid) {
          console.log('Highest bid is not valid (cancelled or unauthorized)');
          setHighestBid(null);
          setCurrentPrice(productData.current_price || productData.starting_price || 0);
        } else {
          setHighestBid(productData.highest_bid);
          setCurrentPrice(productData.highest_bid);
        }
      } else {
        setHighestBid(null);
        setCurrentPrice(productData.current_price || productData.starting_price || 0);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error verifying highest bid:', err);
      setIsLoading(false);
    }
  };

  // Function to handle manual sending of auction result email
  const handleSendAuctionResultEmail = async () => {
    try {
      setIsSendingEmail(true);
      const result = await sendAuctionResultEmail(product.id);
      toast({
        title: "Email sent successfully",
        description: "The auction result email has been sent to all participants."
      });
      console.log("Sent auction result email:", result);
    } catch (error) {
      console.error("Error sending auction result email:", error);
      toast({
        title: "Error sending email",
        description: "Failed to send the auction result email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Subscribe to real-time price updates
  useEffect(() => {
    let isMounted = true;

    // Initial fetch
    fetchHighestBid();
    const channel = supabase.channel('product-price-updates').on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'products',
      filter: `id=eq.${product.id}`
    }, async (payload: any) => {
      console.log('Product updated:', payload);
      if (isMounted) {
        // Re-fetch and validate the highest bid
        await fetchHighestBid();
      }
    }).subscribe();

    // Listen for bid status changes
    const bidChannel = supabase.channel('bid-status-updates').on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'bids',
      filter: `product_id=eq.${product.id}`
    }, async (payload: any) => {
      console.log('Bid updated:', payload);

      // If a bid was cancelled or payment status changed
      if (payload.new.status === 'cancelled' || payload.new.payment_status === 'cancelled') {
        if (isMounted) {
          console.log('Bid cancelled, refreshing highest bid');
          await fetchHighestBid();
          refetchBids();
        }
      }
    }).subscribe();
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
      supabase.removeChannel(bidChannel);
    };
  }, [product.id]);

  // Fetch recent bids with bidder information - ONLY authorized and active bids
  const {
    data: recentBids,
    refetch: refetchBids
  } = useQuery({
    queryKey: ['recent-bids', product.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('bids').select(`
          *,
          bidder:profiles!bids_bidder_id_fkey(full_name)
        `).eq('product_id', product.id).eq('payment_status', 'authorized') // Only fetch authorized bids
      .eq('status', 'active') // Only active bids
      .gte('created_at', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });

  // Fetch all bids for the full history - ONLY authorized and active bids
  const {
    data: allBids
  } = useQuery({
    queryKey: ['all-bids', product.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('bids').select(`
          *,
          bidder:profiles!bids_bidder_id_fkey(full_name)
        `).eq('product_id', product.id).eq('payment_status', 'authorized') // Only fetch authorized bids
      .eq('status', 'active') // Only active bids
      .order('created_at', {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
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
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      const hours = Math.floor(difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
      const minutes = Math.floor(difference % (1000 * 60 * 60) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);

      // Calculate next price drop
      const interval = product.price_decrement_interval === 'hour' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      const nextDropTime = Math.ceil(now / interval) * interval;
      const timeToNextDrop = nextDropTime - now;
      const nextDropHours = Math.floor(timeToNextDrop / (1000 * 60 * 60));
      const nextDropMinutes = Math.floor(timeToNextDrop % (1000 * 60 * 60) / (1000 * 60));
      setNextDrop(`${nextDropHours}h ${nextDropMinutes}m`);
    };
    calculateTimeLeft();

    // Update the countdown every minute
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [product.auction_end_time, product.price_decrement_interval]);

  // Determine the price information to display
  const isAuction = !!product.auction_end_time;
  // Always use highest bid as the displayed price if available
  const displayPrice = highestBid || currentPrice || 0;
  const hasActiveBids = !!highestBid;

  // Check if auction has ended
  const now = new Date();
  const auctionEndTime = product.auction_end_time ? new Date(product.auction_end_time) : null;
  const isAuctionEnded = auctionEndTime && auctionEndTime < now;
  
  return <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                {isAuction ? "Current Price" : "Price"}
              </p>
              <p className="text-3xl font-bold">
                {isLoading ? <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded"></span> : `$${displayPrice.toLocaleString()}`}
              </p>
              {isAuction && <>
                  {hasActiveBids && <p className="text-sm text-emerald-600 font-medium">
                      Current price set by highest authorized bid
                    </p>}
                  {!product.no_reserve && product.reserve_price && <p className="text-sm text-gray-600 mt-1">
                      Reserve Price: ${product.reserve_price.toLocaleString()}
                    </p>}
                  {product.no_reserve && <p className="text-sm text-amber-600 mt-1">
                      No Reserve - Sells at any price
                    </p>}
                </>}
            </div>
            {product.auction_end_time && <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Timer className="h-4 w-4" />
                  <span>{timeLeft}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingDown className="h-4 w-4" />
                  <span>
                    Drops ${product.price_decrement?.toLocaleString() || 0}/{product.price_decrement_interval || 'day'}
                  </span>
                </div>
                {!isAuctionEnded && <p className="text-sm text-amber-600 mt-1">Next drop in: {nextDrop}</p>}
              </div>}
          </div>

          {isAuction && !isAuctionEnded && (
            <div className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] p-3 rounded-md text-white text-sm">
              <p>
                Time Remaining: {timeLeft}
                <br />
                Current Price: ${displayPrice.toLocaleString()}
                {!product.no_reserve && product.reserve_price > 0 && (
                  <>
                    <br />
                    Reserve Price: ${product.reserve_price.toLocaleString()}
                  </>
                )}
              </p>
            </div>
          )}

          {isAuctionEnded && <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-700 mt-3">
              <p>
                <span className="font-medium">Auction Ended:</span> This auction has ended.
                {highestBid ? ` The winning bid was $${highestBid.toLocaleString()}.` : ' There were no bids placed.'}
              </p>
              
              {/* Admin button for sending result emails (for testing) */}
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={handleSendAuctionResultEmail} disabled={isSendingEmail} className="flex items-center gap-1 text-xs">
                  {isSendingEmail ? 'Sending...' : <>
                      <Mail className="h-3 w-3" />
                      Send Result Email
                    </>}
                </Button>
              </div>
            </div>}

          {recentBids && recentBids.length > 0 && <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <p>{recentBids.length} authorized bid{recentBids.length !== 1 ? 's' : ''} placed in the last 12h</p>
              </div>
              
              <div className="space-y-2">
                <ScrollArea className="h-36 rounded-md border">
                  <div className="p-3">
                    {recentBids.slice(0, 3).map((bid: Bid, index: number) => <div key={bid.id} className={`bg-gray-50 p-3 rounded-md mb-2 ${index === 0 ? 'border-l-4 border-green-500' : ''}`}>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{formatBidderName(bid.bidder?.full_name)}</span>
                          <br />
                          <span className="text-gray-500">
                            ${bid.amount.toLocaleString()} • {formatTimeAgo(bid.created_at)}
                            {bid.payment_status === 'authorized' && <span className="ml-2 text-emerald-600">• Authorized</span>}
                          </span>
                        </p>
                      </div>)}
                    
                    {recentBids.length > 3 && <Dialog open={bidHistoryDialogOpen} onOpenChange={setBidHistoryDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full mt-2 flex items-center justify-center gap-1">
                            View More Bids <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <div className="py-4">
                            <h3 className="text-lg font-semibold mb-4">Authorized Bid History</h3>
                            <ScrollArea className="h-[400px]">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Bidder</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {allBids?.map((bid: Bid) => <TableRow key={bid.id}>
                                      <TableCell className="font-medium">{formatBidderName(bid.bidder?.full_name)}</TableCell>
                                      <TableCell className="text-right">${bid.amount.toLocaleString()}</TableCell>
                                      <TableCell className="text-right">{formatDate(bid.created_at)}</TableCell>
                                    </TableRow>)}
                                </TableBody>
                              </Table>
                            </ScrollArea>
                          </div>
                        </DialogContent>
                      </Dialog>}
                  </div>
                </ScrollArea>
              </div>
            </div>}
          
          {product.auction_end_time && !isAuctionEnded && <div className="space-y-3 border p-4 rounded-md">
              <h3 className="font-medium">Place Your Bid</h3>
              <BidForm productId={product.id} productTitle={product.title || "Product"} currentPrice={displayPrice} />
            </div>}

          <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
            <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-2 hover:bg-gray-50">
                  Make an Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <OfferDialog productId={product.id} productTitle={product.title || "Product"} isAuction={!!product.auction_end_time} currentPrice={displayPrice} onClose={() => setOfferDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {product.demo_url}
      </div>
    </Card>;
}
