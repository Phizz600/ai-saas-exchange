
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseMarketplaceProductsProps {
  searchQuery: string;
  industryFilter: string;
  stageFilter: string;
  priceFilter: string;
  timeFilter: string;
  sortBy: string;
  currentPage: number;
  showVerifiedOnly?: boolean;
}

export const useMarketplaceProducts = ({
  searchQuery,
  industryFilter,
  stageFilter,
  priceFilter,
  timeFilter,
  sortBy,
  currentPage,
  showVerifiedOnly = false,
}: UseMarketplaceProductsProps) => {
  const itemsPerPage = 6;

  const fetchProducts = async () => {
    console.log('Fetching products with filters:', {
      searchQuery,
      industryFilter,
      stageFilter,
      priceFilter,
      sortBy,
      currentPage,
      showVerifiedOnly
    });

    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          profiles!inner (
            id,
            full_name,
            avatar_url
          )
        `, { count: 'exact' })
        .eq('status', 'active');

      // Apply filters
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }
      if (industryFilter !== 'all') {
        query = query.eq('category', industryFilter);
      }
      if (stageFilter !== 'all') {
        query = query.eq('stage', stageFilter);
      }
      if (priceFilter !== 'all') {
        const [min, max] = priceFilter.split('-').map(Number);
        query = query.gte('price', min).lte('price', max);
      }

      // Apply verification filter
      if (showVerifiedOnly) {
        query = query.or('is_revenue_verified.eq.true,is_code_audited.eq.true,is_traffic_verified.eq.true');
      }

      // Apply sorting
      switch (sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const start = (currentPage - 1) * itemsPerPage;
      query = query.range(start, start + itemsPerPage - 1);

      const { data: products, error, count } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Products fetched successfully:', {
        count,
        productsLength: products?.length,
        firstProduct: products?.[0]
      });

      // Transform the data to match the expected format
      const transformedProducts = products?.map(product => ({
        ...product,
        seller: product.profiles
      }));

      return { products: transformedProducts, count };

    } catch (error) {
      console.error('Error in fetchProducts:', error);
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', searchQuery, industryFilter, stageFilter, priceFilter, sortBy, currentPage, showVerifiedOnly],
    queryFn: fetchProducts,
  });

  // Get categories overview
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('status', 'active')
        .not('category', 'is', null);

      if (error) throw error;

      const categories = data.reduce((acc: Record<string, number>, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(categories).map(([name, count]) => ({ name, count }));
    },
  });

  return {
    currentItems: data?.products || [],
    totalPages: data?.count ? Math.ceil(data.count / itemsPerPage) : 0,
    isLoading,
    error,
    categoriesOverview: categoriesData || [],
  };
};
