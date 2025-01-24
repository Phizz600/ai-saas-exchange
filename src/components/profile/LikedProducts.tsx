import { useQuery } from "@tanstack/react-query";
import { Heart, Loader2, UserCheck, MailCheck, PhoneCheck, Badge } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { Badge as UIBadge } from "@/components/ui/badge";

interface LikedProductsProps {
  likedProductIds: string[];
}

export const LikedProducts = ({ likedProductIds }: LikedProductsProps) => {
  const { data: likedProducts, isLoading } = useQuery({
    queryKey: ['liked-products', likedProductIds],
    queryFn: async () => {
      if (!likedProductIds.length) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*, seller:profiles(*)')
        .in('id', likedProductIds);

      if (error) throw error;
      return data;
    },
    enabled: likedProductIds.length > 0,
  });

  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-exo flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Liked Products
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!likedProducts?.length) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-exo flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Liked Products
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            You haven't liked any products yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-exo flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Liked Products ({likedProducts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {likedProducts.map((product) => (
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
                timeLeft: "24h left",
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
      </CardContent>
    </Card>
  );
};