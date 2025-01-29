import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductsTable } from "./ProductsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const ProductDashboardContent = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['seller-products'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      console.log('Fetching products for seller:', user.id);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

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
      <div className="flex justify-center mt-8">
        <Link to="/list-product">
          <Button 
            className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity"
          >
            <Plus className="mr-2 h-4 w-4" />
            List Your Product
          </Button>
        </Link>
      </div>
    </div>
  );
};