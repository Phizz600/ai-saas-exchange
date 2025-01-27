import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductsTable } from "./ProductsTable";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const ProductDashboardContent = () => {
  const { toast } = useToast();
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['seller-products'],
    queryFn: async () => {
      console.log('Starting to fetch seller products...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        return [];
      }

      console.log('Fetching products for user:', user.id);

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:profiles (
            id,
            full_name
          )
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          variant: "destructive",
          title: "Error fetching products",
          description: error.message,
        });
        throw error;
      }

      console.log('Products fetched successfully:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load products</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProductsTable products={products || []} />
    </div>
  );
};