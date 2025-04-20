import { useState } from "react";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { ProductContent } from "./product-card/ProductContent";
import { ProductImage } from "./product-card/ProductImage";
import { useNdaStatus } from "./product-card/useNdaStatus";
import { NdaButton } from "./product-card/NdaButton";
import { ProductActions } from "./product-card/ProductActions";
import { useProductCard } from "./product-card/useProductCard";
import { incrementProductClicks } from "@/integrations/supabase/product-analytics";
import { Link, useNavigate } from "react-router-dom";

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
    reserve_price?: number;
    price_decrement?: number;
    price_decrement_interval?: string;
    no_reserve?: boolean;
    listing_type?: string;
    updated_at?: string;
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
  const navigate = useNavigate();
  
  const isAuction = product.listing_type === 'dutch_auction' || !!product.auction_end_time;
  const isVerified = product.is_revenue_verified || product.is_code_audited || product.is_traffic_verified;
  
  // Debug the NDA content to make sure it's being passed correctly
  console.log(`Product ${product.id} - requires_nda:`, product.requires_nda);
  console.log(`Product ${product.id} - nda_content:`, product.nda_content ? 'Present' : 'Not provided');
  
  // Logic to determine if we need to show limited information
  // Ensure product.requires_nda is a boolean, not undefined or null
  const requiresNda = product.requires_nda === true;
  const showLimitedInfo = requiresNda && !hasSigned;
  
  console.log('Product Card:', {
    productId: product.id, 
    requiresNda,
    hasSigned,
    showLimitedInfo,
    ndaContentProvided: !!product.nda_content
  });

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Handle edit click
  };

  // Handle NDA success
  const handleNdaSuccess = () => {
    setHasSigned(true);
  };

  // Handle card click to track analytics
  const handleCardClick = async (e: React.MouseEvent) => {
    try {
      // Track the click event
      await incrementProductClicks(product.id);
      console.log("Product click tracked:", product.id);
      
      // Continue navigation to product page
      navigate(`/product/${product.id}`);
    } catch (error) {
      console.error("Error tracking product click:", error);
      // Still navigate even if tracking fails
      navigate(`/product/${product.id}`);
    }
    
    // Prevent the default link behavior since we're handling navigation
    e.preventDefault();
  };

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
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
            requiresNda={showLimitedInfo}
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
          auction_end_time={product.auction_end_time}
          reserve_price={product.reserve_price}
          price_decrement={product.price_decrement}
          price_decrement_interval={product.price_decrement_interval}
          no_reserve={product.no_reserve}
          listing_type={product.listing_type}
          updated_at={product.updated_at}
        />
        
        <CardFooter className="p-5 pt-0 space-y-3 flex flex-col">
          {showLimitedInfo ? (
            <NdaButton
              productId={product.id}
              productTitle={product.title}
              ndaContent={product.nda_content}
              onSignSuccess={handleNdaSuccess}
            />
          ) : (
            <ProductActions isAuction={isAuction} productId={product.id} />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
