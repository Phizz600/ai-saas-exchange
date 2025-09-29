import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FilterState, MarketplaceProduct } from "@/types/marketplace";
import { useAuth } from "@/contexts/CleanAuthContext";

interface UseMarketplaceQueryProps {
  filters: FilterState;
  currentPage: number;
  itemsPerPage?: number;
  respectAccessLimits?: boolean;
}

export const useMarketplaceQuery = ({ 
  filters, 
  currentPage, 
  itemsPerPage = 6,
  respectAccessLimits = true 
}: UseMarketplaceQueryProps) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['marketplaceProducts', filters, currentPage],
    queryFn: async () => {
      try {
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
          .eq('status', 'active');

        // Apply filters
        if (filters.searchQuery) {
          query = query.ilike('title', `%${filters.searchQuery}%`);
        }
        if (filters.industryFilter !== 'all') {
          query = query.eq('category', filters.industryFilter);
        }
        if (filters.stageFilter !== 'all') {
          query = query.eq('stage', filters.stageFilter);
        }
        if (filters.priceFilter !== 'all') {
          const [min, max] = filters.priceFilter.split('-').map(Number);
          query = query.gte('price', min).lte('price', max);
        }
        if (filters.showVerifiedOnly) {
          query = query.or('is_revenue_verified.eq.true,is_code_audited.eq.true,is_traffic_verified.eq.true');
        }
        if (filters.showAuctionsOnly) {
          query = query.not('auction_end_time', 'is', null);
        } else if (filters.showBuyNowOnly) {
          query = query.is('auction_end_time', null);
        }

        // Apply sorting
        switch (filters.sortBy) {
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'fastest_growing':
            query = query.order('monthly_revenue', { ascending: false, nullsFirst: false });
            break;
          case 'most_interest':
            query = query.order('monthly_traffic', { ascending: false, nullsFirst: false });
            break;
          case 'highest_revenue':
            query = query.order('monthly_revenue', { ascending: false, nullsFirst: false });
            break;
          case 'lowest_churn':
            query = query.order('monthly_churn_rate', { ascending: true, nullsFirst: false });
            break;
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }

        // Apply pagination with access limits
        if (respectAccessLimits && currentPage > 2) {
          // Check if user has premium access
          const { data: hasAccess } = await supabase.rpc('has_marketplace_access', {
            check_user_id: user?.id
          });
          
          if (!hasAccess) {
            // Return empty result for pages beyond 2 for free users
            return { products: [], count: 0 };
          }
        }
        
        const start = (currentPage - 1) * itemsPerPage;
        query = query.range(start, start + itemsPerPage - 1);

        const { data: products, error, count } = await query;

        if (error) {
          console.error('Marketplace query error:', error);
          throw new Error(`Failed to fetch marketplace products: ${error.message}`);
        }

        // Ensure we return properly formatted data
        return {
          products: (products || []) as MarketplaceProduct[],
          count: count || 0
        };
      } catch (error) {
        console.error('Marketplace query failed:', error);
        throw error;
      }
    }
  });
};
