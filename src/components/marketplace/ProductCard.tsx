
import { useState } from "react";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { ProductContent } from "./product-card/ProductContent";
import { ProductImage } from "./product-card/ProductImage";
import { useNdaStatus } from "./product-card/useNdaStatus";
import { NdaButton } from "./product-card/NdaButton";
import { ProductActions } from "./product-card/ProductActions";
import { useProductCard } from "./product-card/useProductCard";
import { incrementProductClicks } from "@/integrations/supabase/product-analytics";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  showInteractionLimits?: boolean;
}

export function ProductCard({ product, showInteractionLimits = false }: ProductCardProps) {
  const { 
    isImageLoaded, 
    setIsImageLoaded, 
    isFavorited,
    timeLeft,
    toggleFavorite
  } = useProductCard(product.id);
  
  const { hasSigned, isCheckingStatus, setHasSigned } = useNdaStatus(product.id);
  const navigate = useNavigate();
  
  const isVerified = product.is_revenue_verified || product.is_code_audited || product.is_traffic_verified;
  
  const requiresNda = product.requires_nda === true;
  const showLimitedInfo = requiresNda && !hasSigned;

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Handle edit click
  };

  const handleNdaSuccess = () => {
    setHasSigned(true);
  };

  const handleCardClick = async (e: React.MouseEvent) => {
    try {
      await incrementProductClicks(product.id);
      console.log("Product click tracked:", product.id);
      navigate(`/product/${product.id}`);
    } catch (error) {
      console.error("Error tracking product click:", error);
      navigate(`/product/${product.id}`);
    }
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
            isAuction={false}
            timeLeft={timeLeft}
            isFavorited={isFavorited}
            isVerified={isVerified}
            requiresNda={showLimitedInfo}
            toggleFavorite={toggleFavorite}
            onEditClick={handleEditClick}
            productId={product.id}
          />
        </CardHeader>
        
        <ProductContent
          title={product.title}
          description={showLimitedInfo ? undefined : product.description}
          price={product.price}
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
            <NdaButton
              productId={product.id}
              productTitle={product.title}
              ndaContent={product.nda_content}
              onSignSuccess={handleNdaSuccess}
            />
          ) : (
            <ProductActions 
              productId={product.id} 
              isAuction={false} 
              showInteractionLimits={showInteractionLimits}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
