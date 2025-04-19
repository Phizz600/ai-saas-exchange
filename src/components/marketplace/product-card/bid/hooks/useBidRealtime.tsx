
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useBidRealtime(productId: string) {
  const [highestBid, setHighestBid] = useState<number | null>(null);
  const [isLoadingBids, setIsLoadingBids] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    console.log(`Initializing bid realtime updates for product ${productId}`);

    const fetchHighestBid = async () => {
      try {
        setIsLoadingBids(true);
        setFetchError(null);
        
        console.log("Fetching highest bid data for product:", productId);
        
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('highest_bid, current_price')
          .eq('id', productId)
          .single();
        
        if (productError) {
          console.error('Error fetching product:', productError);
          setFetchError(`Could not retrieve product data: ${productError.message}`);
          
          toast.error("Error loading bid data", {
            description: "There was a problem retrieving current bid information."
          });
          
          return;
        }
        
        if (product && product.highest_bid) {
          if (mounted) {
            setHighestBid(product.highest_bid);
          }
          return;
        }
        
        const { data: highestBidData, error: bidError } = await supabase
          .from('bids')
          .select('amount')
          .eq('product_id', productId)
          .eq('payment_status', 'authorized')
          .eq('status', 'active')
          .order('amount', { ascending: false })
          .limit(1);

        if (bidError) {
          console.error('Error fetching bids:', bidError);
          setFetchError(`Could not retrieve bid data: ${bidError.message}`);
        }

        if (!bidError && highestBidData && highestBidData.length > 0) {
          if (mounted) {
            setHighestBid(highestBidData[0].amount);
          }
        }
      } catch (err: any) {
        console.error('Error fetching bid data:', err);
        setFetchError(`Unexpected error: ${err.message}`);
        
        toast.error("Error loading bid data", {
          description: "There was a problem retrieving current bid information."
        });
      } finally {
        if (mounted) {
          setIsLoadingBids(false);
        }
      }
    };

    fetchHighestBid();

    // Subscribe to real-time product updates
    const productChannel = supabase
      .channel('product-price-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `id=eq.${productId}`
        },
        (payload: any) => {
          console.log('Product updated:', payload);
          if (mounted && payload.new.highest_bid) {
            setHighestBid(payload.new.highest_bid);
          }
        }
      )
      .subscribe();

    // Listen for new authorized bids
    const bidChannel = supabase
      .channel('authorized-bids-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `product_id=eq.${productId} AND payment_status=eq.authorized AND status=eq.active`
        },
        (payload: any) => {
          console.log('New authorized bid:', payload);
          if (mounted && (!highestBid || payload.new.amount > highestBid)) {
            setHighestBid(payload.new.amount);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bids',
          filter: `product_id=eq.${productId}`
        },
        (payload: any) => {
          console.log('Bid updated:', payload);
          if (payload.new.status === 'cancelled' || payload.new.payment_status === 'cancelled') {
            fetchHighestBid();
          } else if (payload.new.payment_status === 'authorized' && payload.new.status === 'active') {
            if (mounted && (!highestBid || payload.new.amount > highestBid)) {
              setHighestBid(payload.new.amount);
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up bid realtime subscriptions");
      mounted = false;
      supabase.removeChannel(productChannel);
      supabase.removeChannel(bidChannel);
    };
  }, [productId, highestBid]);

  return { highestBid, isLoadingBids, fetchError };
}
