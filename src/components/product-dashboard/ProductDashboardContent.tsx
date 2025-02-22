
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductsTable } from "./ProductsTable";

interface ProductDashboardContentProps {
  showVerifiedOnly: boolean;
}

export const ProductDashboardContent = ({ showVerifiedOnly }: ProductDashboardContentProps) => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['seller-products', showVerifiedOnly],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return [];
      }

      console.log('Fetching products for seller:', user.id);
      
      let query = supabase
        .from('products')
        .select('*, product_analytics(*)')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (showVerifiedOnly) {
        query = query.or('is_revenue_verified.eq.true,is_code_audited.eq.true,is_traffic_verified.eq.true');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      console.log('Products fetched:', data);
      return data;
    },
  });

  useEffect(() => {
    if (error) {
      console.error('Error in ProductDashboardContent:', error);
    }
  }, [error]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="space-y-8">
      <ProductsTable products={products || []} />
    </div>
  );
};
