
import { useState } from "react";
import { Edit2, Bookmark, Heart, TrendingDown, Timer, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductImageProps {
  image?: string;
  title: string;
  isImageLoaded: boolean;
  setIsImageLoaded: (value: boolean) => void;
  isAuction: boolean;
  timeLeft: string;
  isFavorited: boolean;
  isSaved: boolean;
  isVerified: boolean;
  showEditButton?: boolean;
  toggleFavorite: (e: React.MouseEvent) => void;
  toggleSave: (e: React.MouseEvent) => void;
  onEditClick: (e: React.MouseEvent) => void;
}

export function ProductImage({
  image,
  title,
  isImageLoaded,
  setIsImageLoaded,
  isAuction,
  timeLeft,
  isFavorited,
  isSaved,
  isVerified,
  showEditButton = false,
  toggleFavorite,
  toggleSave,
  onEditClick
}: ProductImageProps) {
  return (
    <div className="relative h-48 overflow-hidden bg-gradient-to-r from-[#13293D] to-[#18435A]">
      {!isImageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-blue-700/40 animate-pulse" />
      )}
      <img
        src={image || "/placeholder.svg"}
        alt={title}
        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-100 ${
          isImageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsImageLoaded(true)}
      />
      
      {/* Reduced opacity of the gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
      
      <div className="absolute top-2 right-2 flex gap-0.5 z-30">
        {showEditButton && (
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-black/20 hover:bg-black/30 hover:text-white"
            onClick={onEditClick}
          >
            <Edit2 className="h-5 w-5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`text-white bg-black/20 hover:bg-black/30 hover:text-white ${
            isSaved ? "text-primary" : ""
          }`}
          onClick={toggleSave}
        >
          <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`text-white bg-black/20 hover:bg-black/30 hover:text-white ${
            isFavorited ? "text-red-500" : ""
          }`}
          onClick={toggleFavorite}
        >
          <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
        </Button>
      </div>
      
      {isAuction && (
        <div className="absolute bottom-2 left-2 z-30">
          <Badge variant="secondary" className="bg-amber-500/90 text-white border-0 flex items-center">
            <TrendingDown className="w-3.5 h-3.5 mr-1" />
            Dutch Auction
          </Badge>
        </div>
      )}
      
      {isAuction && timeLeft && (
        <div className="absolute bottom-2 right-2 z-30">
          <Badge variant="secondary" className="bg-black/70 text-amber-50 border-0">
            <Timer className="w-3.5 h-3.5 mr-1" />
            {timeLeft}
          </Badge>
        </div>
      )}
      
      {/* Verification Badge - only show if product is verified */}
      {isVerified && (
        <div className="absolute top-2 left-2 z-30">
          <Badge variant="secondary" className="bg-green-500/90 text-white border-0 flex items-center">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Verified
          </Badge>
        </div>
      )}
    </div>
  );
}
