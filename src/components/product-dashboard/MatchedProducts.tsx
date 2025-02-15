
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { getMatchedProducts } from "@/integrations/supabase/functions";
import { EmptyState } from "../marketplace/EmptyState";

export const MatchedProducts = () => {
  const { data: matchedProducts = [], isLoading } = useQuery({
    queryKey: ['matchedProducts'],
    queryFn: getMatchedProducts
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!matchedProducts.length) {
    return (
      <EmptyState
        title="No Matches Found"
        description="We'll notify you when we find products that match your investment preferences."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {matchedProducts.map((product) => (
        <ProductCard
          key={product.product_id}
          product={{
            id: product.product_id,
            title: product.title,
            description: product.description || "",
            price: Number(product.price),
            category: product.category,
            stage: product.stage,
            image: product.image_url || "/placeholder.svg",
            matchScore: Math.round(product.match_score)
          }}
        />
      ))}
    </div>
  );
};
