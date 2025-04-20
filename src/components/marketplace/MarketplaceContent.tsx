
import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { MarketplacePagination } from "@/components/marketplace/MarketplacePagination";
import { EmptyState } from "@/components/marketplace/EmptyState";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { MarketplaceControls } from "@/components/marketplace/MarketplaceControls";
import { useMarketplaceFilters } from "@/hooks/marketplace/useMarketplaceFilters";
import { useMarketplaceQuery } from "@/hooks/marketplace/useMarketplaceQuery";
import { useProductViewTracking } from "@/hooks/marketplace/useProductViewTracking";
import { useNotifications } from "./notifications/useNotifications";
import { convertToProductWithSeller } from "@/utils/marketplace/productConverter";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

// Using the type from the ProductGrid component to ensure compatibility
type ProductGridCompatibleType = Database['public']['Tables']['products']['Row'] & {
  seller: Database['public']['Tables']['profiles']['Row'] | null;
  no_reserve?: boolean;
  reserve_price?: number;
  listing_type?: string;
  updated_at?: string;
};

export const MarketplaceContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Debug mounting
  useEffect(() => {
    console.log('MarketplaceContent mounted');
    return () => console.log('MarketplaceContent unmounted');
  }, []);
  
  const { filters, updateFilter, resetFilters } = useMarketplaceFilters();
  
  // Debug filters
  useEffect(() => {
    console.log('Current filters:', filters);
  }, [filters]);
  
  const {
    data,
    isLoading,
    refetch
  } = useMarketplaceQuery({
    filters,
    currentPage
  });
  
  // Debug data loading
  useEffect(() => {
    console.log('Market data loaded:', {
      productsCount: data?.products?.length || 0,
      totalCount: data?.count || 0,
      isLoading
    });
  }, [data, isLoading]);
  
  const {
    notifications,
    unreadCount,
    markAsRead
  } = useNotifications();
  
  // Debug notifications
  useEffect(() => {
    console.log('Notifications state:', {
      count: notifications?.length || 0,
      unreadCount
    });
  }, [notifications, unreadCount]);

  useProductViewTracking(data?.products, isLoading);

  const handleRefresh = async () => {
    console.log('Starting refresh...');
    setIsRefreshing(true);
    try {
      await refetch();
      console.log('Refresh completed successfully');
      toast.success("Marketplace products refreshed");
    } catch (error) {
      console.error("Error refreshing products:", error);
      toast.error("Failed to refresh products");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Convert products for the ProductGrid component if they exist
  // Using type assertion to avoid the type mismatch
  const convertedProducts = data?.products 
    ? convertToProductWithSeller(data.products) as unknown as ProductGridCompatibleType[]
    : [];
  
  // Debug converted products
  useEffect(() => {
    console.log('Converted products:', {
      count: convertedProducts.length,
      firstProduct: convertedProducts[0] ? {
        id: convertedProducts[0].id,
        title: convertedProducts[0].title,
        price: convertedProducts[0].price,
        seller: convertedProducts[0].seller
      } : null
    });
  }, [convertedProducts]);
  
  return (
    <>
      <MarketplaceControls
        showVerifiedOnly={filters.showVerifiedOnly}
        onVerifiedChange={(checked) => {
          console.log('Verified filter changed:', checked);
          updateFilter('showVerifiedOnly', checked);
        }}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      <MarketplaceHeader 
        filters={filters}
        onUpdateFilter={(key, value) => {
          console.log('Filter updated:', { key, value });
          updateFilter(key, value);
        }}
        onResetFilters={() => {
          console.log('Filters reset');
          resetFilters();
        }}
        isLoading={isLoading}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
      />

      {isLoading ? (
        <ProductGrid products={[]} isLoading={true} />
      ) : (
        data?.products && data.products.length > 0 ? (
          <>
            <ProductGrid 
              products={convertedProducts}
              isLoading={false}
            />
            <MarketplacePagination 
              currentPage={currentPage} 
              totalPages={Math.ceil((data.count || 0) / 6)}
              setCurrentPage={(page) => {
                console.log('Page changed to:', page);
                setCurrentPage(page);
              }}
            />
          </> 
        ) : (
          <EmptyState />
        )
      )}
    </>
  );
};
