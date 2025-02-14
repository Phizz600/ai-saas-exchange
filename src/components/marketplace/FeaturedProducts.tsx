
import { ProductCard } from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const FeaturedProducts = () => {
  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:profiles (
            id,
            full_name,
            avatar_url,
            achievements
          )
        `)
        .eq('status', 'active')
        .gte('monthly_revenue', 5000)
        .order('monthly_revenue', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    }
  });

  if (featuredProducts.length === 0) return null;

  return (
    <Card className="p-4 mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-xl border-primary/10">
      <h2 className="text-xl font-semibold mb-4 text-accent">Trending Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredProducts.map((product) => (
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
                achievements: product.seller?.achievements || []
              }
            }}
          />
        ))}
      </div>
    </Card>
  );
};
