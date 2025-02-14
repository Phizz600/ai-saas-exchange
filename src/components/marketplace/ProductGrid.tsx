
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

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="bg-gray-50 rounded-full p-4 mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600 max-w-md">
          We couldn't find any products matching your search criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8 px-4 max-w-[1400px] mx-auto">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            id: product.id,
            title: product.title,
            description: product.description || "",
            price: product.current_price || Number(product.price),
            category: product.category,
            stage: product.stage,
            monthlyRevenue: Number(product.monthly_revenue || 0),
            image: product.image_url || "/placeholder.svg",
            auction_end_time: product.auction_end_time,
            current_price: product.current_price,
            min_price: product.min_price,
            price_decrement: product.price_decrement,
            seller: {
              id: product.seller?.id || "",
              name: product.seller?.full_name || "Anonymous",
              avatar: product.seller?.avatar_url || "/placeholder.svg"
            }
          }}
          showEditButton={session?.user?.id === product.seller_id}
        />
      ))}
    </div>
  );
};
