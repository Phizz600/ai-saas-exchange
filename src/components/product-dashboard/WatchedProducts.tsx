import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";

export const WatchedProducts = () => {
  const { data: watchedProducts, isLoading } = useQuery({
    queryKey: ['watched-products'],
    queryFn: async () => {
      console.log('Fetching watched products');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get products with high view counts from the user
      const { data, error } = await supabase
        .from('product_analytics')
        .select(`
          *,
          product:products (
            id,
            title,
            price,
            image_url,
            category,
            stage
          )
        `)
        .gt('views', 5) // Products viewed more than 5 times
        .order('views', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching watched products:', error);
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!watchedProducts?.length) {
    return (
      <Card className="flex items-center justify-center p-8 bg-white/90">
        <p className="text-gray-500 text-lg">No products being watched at the moment</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {watchedProducts.map((item) => (
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
              <span className="text-xs text-gray-500">{item.views} views</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};