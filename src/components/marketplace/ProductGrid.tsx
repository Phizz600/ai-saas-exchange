
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./product-card/ProductCardSkeleton";
import { Search } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { useSession } from '@supabase/auth-helpers-react';

type ProductWithSeller = Database['public']['Tables']['products']['Row'] & {
  seller: Database['public']['Tables']['profiles']['Row'] | null;
};

interface ProductGridProps {
  products: ProductWithSeller[];
  isLoading?: boolean;
  onProductView?: (productId: string) => void;
}

export const ProductGrid = ({ products, isLoading = false, onProductView }: ProductGridProps) => {
  const session = useSession();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8 px-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white/50 rounded-xl shadow-sm">
        <div className="bg-gray-100 rounded-full p-6 mb-6">
          <Search className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 exo-2-heading">No products found</h3>
        <p className="text-gray-600 max-w-md">
          We couldn't find any products matching your search criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8 px-4 max-w-[1400px] mx-auto">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          whileHover={{ y: -5 }}
          className="h-full"
        >
          <ProductCard
            product={{
              id: product.id,
              title: product.title || "",
              description: product.description || "",
              price: product.price || 0,
              category: product.category || "",
              stage: product.stage || "",
              monthlyRevenue: Number(product.monthly_revenue || 0),
              monthly_profit: Number(product.monthly_profit || 0),
              gross_profit_margin: Number(product.gross_profit_margin || 0),
              monthly_churn_rate: Number(product.monthly_churn_rate || 0),
              monthly_traffic: Number(product.monthly_traffic || 0),
              image: product.image_url || "/placeholder.svg",
              auction_end_time: product.auction_end_time,
              current_price: product.current_price,
              min_price: product.min_price,
              price_decrement: product.price_decrement,
              is_revenue_verified: product.is_revenue_verified,
              is_code_audited: product.is_code_audited, 
              is_traffic_verified: product.is_traffic_verified,
              requires_nda: product.requires_nda,
              nda_content: product.nda_content,
              seller: {
                id: product.seller?.id || "",
                full_name: product.seller?.full_name || "Anonymous",
                avatar_url: product.seller?.avatar_url || "/placeholder.svg"
              }
            }}
            showEditButton={session?.user?.id === product.seller_id}
          />
        </motion.div>
      ))}
    </div>
  );
};
