import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "./product-card/ProductCardSkeleton";
import { Search } from "lucide-react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  stage: string;
  monthlyRevenue: number;
  image: string;
  timeLeft: string;
  seller: {
    id: number;
    name: string;
    avatar: string;
    achievements: {
      type: "FirstTimeBuyer" | "SuccessfulAcquisition" | "TopBidder" | "DealmakerOfMonth";
      label: string;
    }[];
  };
}

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export const ProductGrid = ({ products, isLoading = false }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};