
import { useState } from "react";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { ProductCardContent } from "./product-card/ProductCardContent";
import { ProductImage } from "./product-card/ProductImage";
import { useNdaStatus } from "./product-card/useNdaStatus";
import { NdaButton } from "./product-card/NdaButton";
import { ProductCardActions } from "./product-card/ProductCardActions";
import { useProductCard } from "./product-card/useProductCard";

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
    min_price?: number;
    price_decrement?: number;
    price_decrement_interval?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { 
    isImageLoaded, 
    setIsImageLoaded, 
    isFavorited, 
    isSaved, 
    timeLeft,
    toggleFavorite, 
    toggleSave 
  } = useProductCard(product.id);
  
  const { hasSigned, isCheckingStatus, setHasSigned } = useNdaStatus(product.id);
  
  const isAuction = !!product.auction_end_time;
  const isVerified = product.is_revenue_verified || product.is_code_audited || product.is_traffic_verified;
  
  // Handle edit click
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Handle edit click
  };

  // Handle NDA success
  const handleNdaSuccess = () => {
    setHasSigned(true);
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
          requiresNda={product.requires_nda}
          hasSignedNda={hasSigned}
          toggleFavorite={toggleFavorite}
          toggleSave={toggleSave}
          onEditClick={handleEditClick}
        />
      </CardHeader>
      
      <ProductCardContent
        title={product.title}
        description={product.description}
        price={product.price}
        current_price={product.current_price}
        category={product.category || "Other"}
        stage={product.stage || "Unknown"}
        monthlyRevenue={product.monthly_revenue}
        auction_end_time={product.auction_end_time}
        min_price={product.min_price}
        price_decrement={product.price_decrement}
        price_decrement_interval={product.price_decrement_interval}
        requires_nda={product.requires_nda}
        has_signed_nda={hasSigned}
      />
      
      <CardFooter className="p-5 pt-0 space-y-3 flex flex-col">
        {product.requires_nda && !hasSigned ? (
          <NdaButton
            productId={product.id}
            productTitle={product.title}
            ndaContent={product.nda_content}
            onSignSuccess={handleNdaSuccess}
          />
        ) : (
          <ProductCardActions product={product} />
        )}
      </CardFooter>
    </Card>
  );
}
