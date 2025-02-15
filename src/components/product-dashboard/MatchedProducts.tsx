
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { getMatchedProducts } from "@/integrations/supabase/functions";
import { Card } from "@/components/ui/card";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">No Matches Found</h3>
        <p className="text-gray-600 mb-4">
          We'll notify you when we find products that match your investment preferences.
        </p>
        <Button asChild>
          <Link to="/marketplace" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Browse Marketplace
          </Link>
        </Button>
      </Card>
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
            monthlyRevenue: 0,
            image: product.image_url || "/placeholder.svg",
            seller: {
              id: "",
              name: "",
              avatar: "",
              achievements: []
            }
          }}
        />
      ))}
    </div>
  );
};
