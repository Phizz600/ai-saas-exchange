import { Shield, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RelatedProducts } from "./RelatedProducts";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardDialogProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    stage: string;
    monthlyRevenue: number;
    image: string;
    timeLeft: string;
    auction_end_time?: string;
    current_price?: number;
    min_price?: number;
    price_decrement?: number;
  };
}

export function ProductCardDialog({ product }: ProductCardDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAuction = !!product.auction_end_time;
  const auctionEnded = isAuction && new Date(product.auction_end_time) < new Date();

  const handleBid = async () => {
    if (!product.current_price) return;
    
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to place a bid",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('bids')
        .insert({
          product_id: product.id,
          bidder_id: user.id,
          amount: product.current_price
        });

      if (error) throw error;

      toast({
        title: "Bid placed successfully!",
        description: `You've placed a bid for ${product.current_price}`,
      });

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
    <div className="grid gap-4">
      <div className="aspect-video overflow-hidden rounded-lg">
        <img 
          src={product.image} 
          alt={product.title} 
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">{product.title}</h2>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {isAuction ? (
            <>
              <div>
                <p className="text-sm text-gray-500">Current Price</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">
                  ${product.current_price?.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Min Price: ${product.min_price?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price Drop</p>
                <p className="text-lg font-semibold text-amber-600">
                  ${product.price_decrement?.toLocaleString()}/min
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {auctionEnded ? "Auction ended" : product.timeLeft}
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-xl sm:text-2xl font-bold">${product.price.toLocaleString()}</p>
              </div>
              {product.stage === "Revenue" && (
                <div>
                  <p className="text-sm text-gray-500">Monthly Revenue</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    ${product.monthlyRevenue.toLocaleString()}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        
        {isAuction && !auctionEnded && (
          <Button 
            className="w-full mt-4 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]"
            onClick={handleBid}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing bid..." : "Place Bid"}
          </Button>
        )}
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          This transaction is protected by our Secure Purchase Program. 
          Payment is held in escrow until both parties confirm the transfer is complete.
        </AlertDescription>
      </Alert>

      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          Always communicate and complete transactions through our platform 
          for your security. Report suspicious behavior immediately.
        </AlertDescription>
      </Alert>

      <RelatedProducts 
        currentProductCategory={product.category}
        currentProductId={product.id}
      />
    </div>
  );
}