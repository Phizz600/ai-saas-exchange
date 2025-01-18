import { Heart, Bookmark, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SellerHoverCard } from "./SellerHoverCard";
import { useState } from "react";

interface ProductCardImageProps {
  image: string;
  title: string;
  timeLeft: string;
  isFavorited: boolean;
  onFavoriteClick: () => void;
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
      <div className="absolute top-2 right-2 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
          onClick={() => {
            console.log('Analytics: Product bookmarked', { title });
          }}
        >
          <Bookmark className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`bg-white/10 backdrop-blur-md hover:bg-white/20 text-white ${
            isFavorited ? "text-red-500" : ""
          }`}
          onClick={() => {
            onFavoriteClick();
            console.log('Analytics: Product favorited', { title });
          }}
        >
          <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
        </Button>
      </div>
      <div className="absolute bottom-2 right-2 flex gap-2">
        <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-md">
          <Clock className="h-4 w-4 mr-1" />
          {timeLeft}
        </Badge>
        <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-md">
          <Eye className="h-4 w-4 mr-1" />
          2.5k views
        </Badge>
      </div>
      <SellerHoverCard seller={seller} />
    </div>
  );
}