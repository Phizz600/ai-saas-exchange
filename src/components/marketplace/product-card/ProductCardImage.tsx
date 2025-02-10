
import { Heart, Bookmark, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SellerHoverCard } from "./SellerHoverCard";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProductCardImageProps {
  image: string;
  title: string;
  timeLeft: string;
  isFavorited: boolean;
  onFavoriteClick: (e: React.MouseEvent) => void;
  seller: {
    name: string;
    avatar: string;
    achievements: {
      type: "FirstTimeBuyer" | "SuccessfulAcquisition" | "TopBidder" | "DealmakerOfMonth";
      label: string;
    }[];
  };
}

export function ProductCardImage({ 
  image, 
  title, 
  timeLeft, 
  seller,
  isFavorited,
  onFavoriteClick 
}: ProductCardImageProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const handleSaveClick = async (e: React.MouseEvent) => {
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
      const productId = window.location.pathname.split('/').pop();

      if (!productId) {
        console.error('No product ID found');
        return;
      }

      const newSaves = isSaved
        ? currentSaves.filter((id: string) => id !== productId)
        : [...currentSaves, productId];

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
      console.error('Error toggling product save:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative aspect-video overflow-hidden">
      {!isImageLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      <img
        src={image}
        alt={title}
        className={`object-cover w-full h-full transform group-hover:scale-105 transition-all duration-300 ${
          isImageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => {
          setIsImageLoaded(true);
          console.log('Image loaded:', title);
        }}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="absolute top-2 left-2">
        <Avatar className="h-8 w-8 border-2 border-white shadow-md">
          <AvatarImage src={seller.avatar} alt={seller.name} />
          <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="absolute top-2 right-2 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className={`bg-white/10 backdrop-blur-md hover:bg-white/20 text-white ${
            isSaved ? "text-primary" : ""
          }`}
          onClick={handleSaveClick}
        >
          <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`bg-white/10 backdrop-blur-md hover:bg-white/20 text-white ${
            isFavorited ? "text-red-500" : ""
          }`}
          onClick={onFavoriteClick}
        >
          <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
        </Button>
      </div>
      <div className="absolute bottom-2 right-2">
        <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-md">
          <Clock className="h-4 w-4 mr-1" />
          {timeLeft}
        </Badge>
      </div>
      <SellerHoverCard seller={seller} />
    </div>
  );
}
