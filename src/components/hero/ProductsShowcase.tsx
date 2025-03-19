
import { motion } from "framer-motion";
import { ProductCard } from "./product-showcase/ProductCard";
import { placeholderProducts } from "./product-showcase/placeholderProducts";
import { Button } from "@/components/ui/button";

interface ProductsShowcaseProps {
  isAuthenticated: boolean;
  handleAuthRedirect: () => void;
}

export const ProductsShowcase = ({ 
  isAuthenticated, 
  handleAuthRedirect 
}: ProductsShowcaseProps) => {
  return (
    <div className="flex flex-col items-center gap-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {placeholderProducts.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            isAuthenticated={isAuthenticated}
            handleAuthRedirect={handleAuthRedirect}
          />
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <Button 
          onClick={handleAuthRedirect} 
          className="px-8 py-6 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white text-lg"
        >
          Load More
        </Button>
      </motion.div>
    </div>
  );
};
