
import { useState } from "react";
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
  
  const { filters, updateFilter, resetFilters } = useMarketplaceFilters();
  
  const {
    data,
    isLoading,
    refetch
  } = useMarketplaceQuery({
    filters,
    currentPage
  });
  
  const {
    notifications,
    unreadCount,
    markAsRead
  } = useNotifications();

  // Use the hook for view tracking
  useProductViewTracking(data?.products, isLoading);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
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
  
  return (
    <>
      <MarketplaceControls
        showVerifiedOnly={filters.showVerifiedOnly}
        onVerifiedChange={(checked) => updateFilter('showVerifiedOnly', checked)}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      <MarketplaceHeader 
        filters={filters}
        onUpdateFilter={updateFilter}
        onResetFilters={resetFilters}
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
              setCurrentPage={setCurrentPage}
            />
          </> 
        ) : (
          <EmptyState />
        )
      )}
    </>
  );
};
