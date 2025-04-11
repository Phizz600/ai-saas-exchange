
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
  showAuctionsOnly?: boolean;
  showBuyNowOnly?: boolean;
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
  showAuctionsOnly = false,
  showBuyNowOnly = false,
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
      showVerifiedOnly,
      showAuctionsOnly,
      showBuyNowOnly
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
      
      // Apply listing type filters
      if (showAuctionsOnly) {
        query = query.not('auction_end_time', 'is', null);
      } else if (showBuyNowOnly) {
        query = query.is('auction_end_time', null);
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
        case 'popular':
          // For popular products, use a more comprehensive approach
          // First fetch product IDs with their analytics data
          const { data: analyticsData } = await supabase
            .from('product_analytics')
            .select('product_id, views, clicks, saves, likes, bids')
            .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // Last 7 days
          
          if (analyticsData && analyticsData.length > 0) {
            // Calculate engagement score for each product
            const productScores = analyticsData.reduce((acc, item) => {
              const productId = item.product_id;
              if (!acc[productId]) {
                acc[productId] = 0;
              }
              // Weight different engagement types
              acc[productId] += (item.views || 0) * 1;       // 1 point per view
              acc[productId] += (item.clicks || 0) * 2;      // 2 points per click
              acc[productId] += (item.saves || 0) * 5;       // 5 points per save
              acc[productId] += (item.likes || 0) * 3;       // 3 points per like
              acc[productId] += (item.bids || 0) * 10;       // 10 points per bid
              return acc;
            }, {});
            
            // Sort products by their engagement score
            const sortedProductIds = Object.entries(productScores)
              .sort(([, scoreA], [, scoreB]) => (scoreB as number) - (scoreA as number))
              .map(([id]) => id);
            
            if (sortedProductIds.length > 0) {
              // Use the in operator with the sorted product IDs
              query = query.in('id', sortedProductIds);
              // Note: This won't preserve the exact order, but it's a limitation of the current approach
              // Ideally, we would retrieve all products and sort them on the client side
            } else {
              // Fallback to views if no engagement data
              query = query.order('views', { ascending: false, nullsFirst: false });
            }
          } else {
            // Fallback to views if no analytics data
            query = query.order('views', { ascending: false, nullsFirst: false });
          }
          break;
        case 'ending_soon':
          // Only include auctions with end times in the future
          query = query
            .gt('auction_end_time', new Date().toISOString())
            .not('auction_end_time', 'is', null)
            .order('auction_end_time', { ascending: true });
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
    queryKey: ['products', searchQuery, industryFilter, stageFilter, priceFilter, sortBy, currentPage, showVerifiedOnly, showAuctionsOnly, showBuyNowOnly],
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
