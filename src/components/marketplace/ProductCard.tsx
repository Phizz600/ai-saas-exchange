
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useProductCard } from "./product-card/useProductCard";
import { useAuctionTimer } from "./product-card/useAuctionTimer";
import { ProductImage } from "./product-card/ProductImage";
import { ProductContent } from "./product-card/ProductContent";
import { ProductButtons } from "./product-card/ProductButtons";
import { EditProductDialog } from "./product-card/EditProductDialog";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description?: string;
    price?: number;
    category?: string;
    stage?: string;
    monthlyRevenue?: number;
    monthly_profit?: number;
    gross_profit_margin?: number;
    monthly_churn_rate?: number;
    monthly_traffic?: number;
    image?: string;
    auction_end_time?: string;
    current_price?: number;
    min_price?: number;
    price_decrement?: number;
    is_revenue_verified?: boolean;
    is_code_audited?: boolean;
    is_traffic_verified?: boolean;
    seller: {
      id: string;
      name: string;
      avatar: string;
    };
  };
  showEditButton?: boolean;
}

export function ProductCard({ product, showEditButton = false }: ProductCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { timeLeft } = useAuctionTimer(product.auction_end_time);
  const { 
    isImageLoaded, 
    setIsImageLoaded, 
    isFavorited, 
    isSaved, 
    toggleFavorite, 
    toggleSave 
  } = useProductCard(product.id);

  const isAuction = !!product.auction_end_time;
  const isVerified = product.is_revenue_verified || product.is_code_audited || product.is_traffic_verified;

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <Link to={`/product/${product.id}`} className="group">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-gray-100/50 group-hover:border-blue-100/50 relative bg-white backdrop-blur-sm">
            {/* Product Image Section */}
            <ProductImage 
              image={product.image}
              title={product.title}
              isImageLoaded={isImageLoaded}
              setIsImageLoaded={setIsImageLoaded}
              isAuction={isAuction}
              timeLeft={timeLeft}
              isFavorited={isFavorited}
              isSaved={isSaved}
              isVerified={isVerified}
              showEditButton={showEditButton}
              toggleFavorite={toggleFavorite}
              toggleSave={toggleSave}
              onEditClick={handleEditClick}
            />

            {/* Product Content Section */}
            <ProductContent 
              title={product.title}
              description={product.description}
              price={product.price}
              current_price={product.current_price}
              category={product.category}
              stage={product.stage}
              monthlyRevenue={product.monthlyRevenue}
              monthly_traffic={product.monthly_traffic}
              gross_profit_margin={product.gross_profit_margin}
              monthly_churn_rate={product.monthly_churn_rate}
              is_revenue_verified={product.is_revenue_verified}
              is_code_audited={product.is_code_audited}
              is_traffic_verified={product.is_traffic_verified}
            />
            
            {/* Action Buttons */}
            <ProductButtons isAuction={isAuction} />
          </Card>
        </motion.div>
      </Link>

      {/* Edit Dialog */}
      <EditProductDialog
        product={product}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  );
}
