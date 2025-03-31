
import { useState } from "react";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { ProductContent } from "./product-card/ProductContent";
import { ProductImage } from "./product-card/ProductImage";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { NdaDialog } from "./product-card/NdaDialog";
import { useNdaStatus } from "./product-card/useNdaStatus";
import { LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description?: string;
    price: number;
    category?: string;
    stage?: string;
    monthly_revenue?: number;
    image_url?: string;
    seller?: {
      id: string;
      full_name?: string;
      avatar_url?: string;
    };
    monthly_traffic?: number;
    gross_profit_margin?: number;
    monthly_churn_rate?: number;
    is_revenue_verified?: boolean;
    is_code_audited?: boolean;
    is_traffic_verified?: boolean;
    requires_nda?: boolean;
    nda_content?: string;
    auction_end_time?: string;
    current_price?: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const isAuction = !!product.auction_end_time;
  const isVerified = product.is_revenue_verified || product.is_code_audited || product.is_traffic_verified;
  
  const { hasSigned, isCheckingStatus, setHasSigned } = useNdaStatus(product.id);
  const [isNdaDialogOpen, setIsNdaDialogOpen] = useState(false);

  // Logic to determine if we need to show limited information
  const showLimitedInfo = product.requires_nda && !hasSigned;

  // Calculate time left for auction
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  useState(() => {
    if (!product.auction_end_time) return;
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const endTime = new Date(product.auction_end_time!);
      const difference = endTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft('Ended');
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  });

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to favorite products",
          variant: "destructive",
        });
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('liked_products')
        .eq('id', user.id)
        .single();

      const currentLikes = profile?.liked_products || [];
      const newLikes = isFavorited
        ? currentLikes.filter((id: string) => id !== product.id)
        : [...currentLikes, product.id];

      await supabase
        .from('profiles')
        .update({ 
          liked_products: newLikes,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Product unfavorited" : "Product favorited",
        description: isFavorited ? "Removed from your favorites" : "Added to your favorites",
      });

    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save products",
          variant: "destructive",
        });
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('saved_products')
        .eq('id', user.id)
        .single();

      const currentSaves = profile?.saved_products || [];
      const newSaves = isSaved
        ? currentSaves.filter((id: string) => id !== product.id)
        : [...currentSaves, product.id];

      await supabase
        .from('profiles')
        .update({ 
          saved_products: newSaves,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      setIsSaved(!isSaved);
      toast({
        title: isSaved ? "Product unsaved" : "Product saved",
        description: isSaved ? "Removed from your saved products" : "Added to your saved products",
      });

    } catch (error) {
      console.error('Error toggling save:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Handle edit click
  };

  // Handle NDA success
  const handleNdaSuccess = () => {
    setHasSigned(true);
    setIsNdaDialogOpen(false);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 group hover:shadow-md">
      <CardHeader className="p-0">
        <ProductImage
          image={product.image_url || "/placeholder.svg"}
          title={product.title}
          isImageLoaded={isImageLoaded}
          setIsImageLoaded={setIsImageLoaded}
          isAuction={isAuction}
          timeLeft={timeLeft}
          isFavorited={isFavorited}
          isSaved={isSaved}
          isVerified={isVerified}
          toggleFavorite={toggleFavorite}
          toggleSave={toggleSave}
          onEditClick={handleEditClick}
        />
      </CardHeader>
      
      <ProductContent
        title={product.title}
        description={showLimitedInfo ? undefined : product.description}
        price={product.price}
        current_price={product.current_price}
        category={product.category}
        stage={product.stage}
        monthlyRevenue={product.monthly_revenue}
        monthly_traffic={product.monthly_traffic}
        gross_profit_margin={product.gross_profit_margin}
        monthly_churn_rate={product.monthly_churn_rate}
        is_revenue_verified={product.is_revenue_verified}
        is_code_audited={product.is_code_audited}
        is_traffic_verified={product.is_traffic_verified}
        requires_nda={showLimitedInfo}
      />
      
      <CardFooter className="p-5 pt-0 space-y-3 flex flex-col">
        {showLimitedInfo ? (
          <Dialog open={isNdaDialogOpen} onOpenChange={setIsNdaDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white font-medium shadow-md"
              >
                <LockIcon className="h-4 w-4 mr-2" />
                Sign NDA to View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <NdaDialog
                productId={product.id}
                productTitle={product.title}
                ndaContent={product.nda_content || ""}
                onClose={() => setIsNdaDialogOpen(false)}
                onSuccess={handleNdaSuccess}
              />
            </DialogContent>
          </Dialog>
        ) : (
          <Button 
            className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            {isAuction ? "Bid Now" : "Buy"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
