import { useState } from "react";
import { Edit2, Bookmark, Heart, TrendingDown, Timer, CheckCircle, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfidentialWatermark } from "./ConfidentialWatermark";

interface ProductImageProps {
  image?: string;
  title: string;
  isImageLoaded: boolean;
  setIsImageLoaded: (value: boolean) => void;
  isAuction: boolean;
  timeLeft: string;
  isFavorited: boolean;
  isVerified: boolean;
  requiresNda?: boolean;
  toggleFavorite: (e: React.MouseEvent) => void;
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
  isVerified,
  requiresNda = false,
  toggleFavorite,
  onEditClick
}: ProductImageProps) {
  // Debug the requiresNda prop
  console.log(`ProductImage - ${title} - requiresNda:`, requiresNda);
  
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
        } ${requiresNda ? 'blur-md' : ''}`}
        onLoad={() => setIsImageLoaded(true)}
      />
      
      {/* NDA Confidential overlay with enhanced visuals */}
      {requiresNda && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 text-white p-4 text-center">
          <div className="bg-purple-500/20 p-3 rounded-full mb-3">
            <Lock className="h-10 w-10 text-purple-300" />
          </div>
          <p className="font-bold text-base mb-1 exo-2-heading">CONFIDENTIAL</p>
          <p className="font-medium text-sm mb-3">Sign NDA to view details</p>
          <Badge 
            variant="outline" 
            className="bg-purple-900/50 text-white border-purple-500/20 flex items-center"
          >
            <Eye className="h-3 w-3 mr-1" />
            Protected Content
          </Badge>
        </div>
      )}
      
      {/* Add watermark for confidential content */}
      {requiresNda && (
        <ConfidentialWatermark opacity={0.15} />
      )}
      
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
