
import { ProductCard } from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RelatedProductsProps {
  currentProductCategory: string;
  currentProductId: string;
}

export const RelatedProducts = ({ currentProductCategory, currentProductId }: RelatedProductsProps) => {
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['relatedProducts', currentProductCategory, currentProductId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:profiles (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .eq('category', currentProductCategory)
        .neq('id', currentProductId)
        .limit(2);

      if (error) throw error;
      return data;
    }
  });

  if (relatedProducts.length === 0) return null;

  return (
    <Card className="p-4 mt-4 bg-white/80 backdrop-blur-xl">
      <h3 className="text-lg font-semibold mb-4">Related Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              title: product.title,
              description: product.description || "",
              price: Number(product.price),
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
                avatar: product.seller?.avatar_url || "/placeholder.svg",
                achievements: []
              }
            }}
          />
        ))}
      </div>
    </Card>
  );
};
