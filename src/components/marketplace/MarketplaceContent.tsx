import { useState, useCallback, useEffect } from "react";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { MarketplacePagination } from "@/components/marketplace/MarketplacePagination";
import { EmptyState } from "@/components/marketplace/EmptyState";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { useMarketplaceFilters } from "@/hooks/marketplace/useMarketplaceFilters";
import { useMarketplaceQuery } from "@/hooks/marketplace/useMarketplaceQuery";
import { useNotifications } from "./notifications/useNotifications";
import { incrementProductViews } from "@/integrations/supabase/product-analytics";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ProductWithSeller } from "@/types/marketplace";

export const MarketplaceContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewTracked, setViewTracked] = useState<Set<string>>(new Set());
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

  // Track product views (impressions) when products appear in the grid
  useEffect(() => {
    if (!data?.products || isLoading) return;

    // Track views for products that haven't been tracked yet in this session
    const trackProductViews = async () => {
      const newProductsToTrack = data.products.filter(product => !viewTracked.has(product.id));
      
      if (newProductsToTrack.length === 0) return;
      
      const newTrackedSet = new Set(viewTracked);
      
      for (const product of newProductsToTrack) {
        try {
          await incrementProductViews(product.id);
          newTrackedSet.add(product.id);
          console.log('Product view/impression tracked:', product.id);
        } catch (error) {
          console.error('Error tracking product impression:', error);
        }
      }
      
      setViewTracked(newTrackedSet);
    };

    trackProductViews();
  }, [data?.products, isLoading, viewTracked]);

  // Handle refresh
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

  // Enhanced conversion function to ensure all required fields are available
  const convertToProductWithSeller = (products: any[]): ProductWithSeller[] => {
    return products.map(product => ({
      ...product,
      seller: product.seller || {
        id: product.seller_id || "",
        full_name: "Anonymous",
        avatar_url: "/placeholder.svg"
      },
      // Ensure all possible fields from the database are included
      active_users: product.active_users || "",
      admin_feedback: product.admin_feedback || "",
      auction_status: product.auction_status || "",
      business_location: product.business_location || "",
      business_model: product.business_model || "",
      business_type: product.business_type || "",
      category: product.category || "",
      // Add other fields with default values to ensure type compatibility
      created_at: product.created_at || new Date().toISOString(),
      status: product.status || "active",
      updated_at: product.updated_at || new Date().toISOString()
    })) as ProductWithSeller[];
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Switch 
            id="verified-only"
            checked={filters.showVerifiedOnly}
            onCheckedChange={(checked) => updateFilter('showVerifiedOnly', checked)}
          />
          <Label htmlFor="verified-only" className="cursor-pointer flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Verified Products Only
          </Label>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

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
              products={convertToProductWithSeller(data.products)}
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
