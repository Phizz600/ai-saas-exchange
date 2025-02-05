import { DashboardLayout } from "@/components/product-dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Star, Zap, Trophy } from "lucide-react";

export const Promote = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['seller-products-for-promotion'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2 font-exo">Promote Your Products</h2>
          <p className="text-gray-600">Choose a promotion package to increase your product's visibility</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-yellow-500">
              <Star className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Featured Listing</h3>
            </div>
            <p className="text-gray-600">Highlight your product in the featured section for 7 days</p>
            <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600">
              $49 / week
            </Button>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-purple-500">
              <Zap className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Spotlight</h3>
            </div>
            <p className="text-gray-600">Premium placement in search results for 14 days</p>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600">
              $89 / 2 weeks
            </Button>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-blue-500">
              <Trophy className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Premium Package</h3>
            </div>
            <p className="text-gray-600">Top placement + featured status for 30 days</p>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600">
              $149 / month
            </Button>
          </Card>
        </div>

        {products && products.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Your Active Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="p-4">
                  <h4 className="font-medium">{product.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">${product.price}</p>
                  <Button variant="outline" className="w-full mt-4">
                    Promote this product
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-600">You don't have any active products to promote</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};