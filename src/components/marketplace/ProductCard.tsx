
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ProductContent } from "./product-card/ProductContent";
import { ProductImage } from "./product-card/ProductImage";
import { useNdaStatus } from "./product-card/useNdaStatus";
import { NdaButton } from "./product-card/NdaButton";
import { ProductActions } from "./product-card/ProductActions";
import { useProductCard } from "./product-card/useProductCard";
import { useSaveProduct } from "@/hooks/useSaveProduct";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { 
    isImageLoaded, 
    setIsImageLoaded, 
    isFavorited,
    timeLeft,
    toggleFavorite 
  } = useProductCard(product.id);
  
  const { isSaved, toggleSave } = useSaveProduct(product.id);
  const { hasSigned, setHasSigned } = useNdaStatus(product.id);
  
  const isAuction = product.listing_type === 'dutch_auction' || !!product.auction_end_time;
  const isVerified = product.is_revenue_verified || product.is_code_audited || product.is_traffic_verified;
  const showLimitedInfo = product.requires_nda === true && !hasSigned;

  // Handle NDA success
  const handleNdaSuccess = () => {
    setHasSigned(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
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
        />
        
        <ProductContent
          product={product}
          showLimitedInfo={showLimitedInfo}
        />

        {showLimitedInfo ? (
          <NdaButton
            productId={product.id}
            productTitle={product.title}
            ndaContent={product.nda_content}
            onSignSuccess={handleNdaSuccess}
          />
        ) : (
          <ProductActions 
            product={product}
            isAuction={isAuction}
          />
        )}
      </Card>
    </motion.div>
  );
}
