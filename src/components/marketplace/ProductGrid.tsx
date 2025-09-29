
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./product-card/ProductCardSkeleton";
import { Search } from "lucide-react";

interface ProductGridProps {
  products: any[];
  isLoading?: boolean;
  onProductView?: (productId: string) => void;
  showInteractionLimits?: boolean;
}

export const ProductGrid = ({ products, isLoading = false, onProductView, showInteractionLimits = false }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center px-4 bg-white/50 rounded-xl shadow-sm mx-4">
        <div className="bg-gray-100 rounded-full p-4 sm:p-6 mb-4 sm:mb-6">
          <Search className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 exo-2-heading">
          No products found
        </h3>
        <p className="text-sm sm:text-base text-gray-600 max-w-md">
          We couldn't find any products matching your search criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 max-w-[1400px] mx-auto">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="h-full"
        >
          <ProductCard product={product} showInteractionLimits={showInteractionLimits} />
        </motion.div>
      ))}
    </div>
  );
};
