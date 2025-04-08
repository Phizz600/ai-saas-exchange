
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseMarketplaceProductsProps {
  searchQuery?: string;
  industryFilter?: string;
  stageFilter?: string;
  priceFilter?: string;
  timeFilter?: string;
  sortBy?: string;
  currentPage?: number;
  showVerifiedOnly?: boolean;
}

export const useMarketplaceProducts = ({
  searchQuery = "",
  industryFilter = "all",
  stageFilter = "all",
  priceFilter = "all",
  timeFilter = "all",
  sortBy = "recent",
  currentPage = 1,
  showVerifiedOnly = false,
}: UseMarketplaceProductsProps = {}) => {
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
      // First, fetch products
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('status', 'active'); // Only show approved/active products

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

      // Log which products have requires_nda set to true
      console.log('Products with requires_nda:', products?.filter(p => p.requires_nda).map(p => ({ id: p.id, title: p.title })));

      // Return products with default seller info
      const productsWithSellers = products?.map(product => ({
        ...product,
        seller: {
          id: product.seller_id,
          full_name: "Loading...",
          avatar_url: "/placeholder.svg"
        }
      })) || [];

      console.log('Products fetched successfully:', {
        count,
        productsLength: productsWithSellers.length,
        firstProduct: productsWithSellers[0]
      });

      return { products: productsWithSellers, count };

    } catch (error) {
      console.error('Error in fetchProducts:', error);
      throw error;
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
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
    refetch, // Add refetch function to allow manual refreshing
    categoriesOverview: categoriesData || [],
  };
};
