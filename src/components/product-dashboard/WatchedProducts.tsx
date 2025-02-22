
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";

export const WatchedProducts = () => {
  const { data: savedProducts, isLoading } = useQuery({
    queryKey: ['saved-products'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // First get the user's saved product IDs from their profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('saved_products')
        .eq('id', user.id)
        .single();

      if (!profile?.saved_products?.length) {
        return [];
      }

      // Then fetch the actual product details for the saved products
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          id,
          title,
          price,
          image_url,
          category,
          stage,
          product_analytics (
            saves
          )
        `)
        .in('id', profile.saved_products)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching saved products:', error);
        throw error;
      }

      return products.map(product => ({
        id: product.id,
        product: {
          id: product.id,
          title: product.title,
          price: product.price,
          image_url: product.image_url,
          category: product.category,
          stage: product.stage
        },
        saves: product.product_analytics?.[0]?.saves || 0
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!savedProducts?.length) {
    return (
      <Card className="flex items-center justify-center p-8 bg-white/90">
        <p className="text-gray-500 text-lg">No products saved at the moment</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {savedProducts.map((item) => (
        <Link to={`/product/${item.product.id}`} key={item.id}>
          <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="aspect-video relative mb-3">
              {item.product.image_url ? (
                <img
                  src={item.product.image_url}
                  alt={item.product.title}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <h3 className="font-medium text-sm mb-1">{item.product.title}</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{formatCurrency(item.product.price)}</span>
              <span className="text-xs text-gray-500">{item.saves} saves</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};
