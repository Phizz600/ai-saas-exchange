
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseProductsProps {
  showVerifiedOnly?: boolean;
}

export const useProducts = ({ showVerifiedOnly = false }: UseProductsProps = {}) => {
  return useQuery({
    queryKey: ['products', showVerifiedOnly],
    queryFn: async () => {
      console.log('Fetching products with verification filter:', showVerifiedOnly);
      let query = supabase
        .from('products')
        .select(`
          *,
          seller:profiles (
            id,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (showVerifiedOnly) {
        query = query.or('is_revenue_verified.eq.true,is_code_audited.eq.true,is_traffic_verified.eq.true');
      }

      const { data: products, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      console.log('Products fetched:', products);
      return products;
    },
  });
};
