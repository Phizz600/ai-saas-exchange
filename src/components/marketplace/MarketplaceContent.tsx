
import { useState, useCallback } from "react";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { MarketplacePagination } from "@/components/marketplace/MarketplacePagination";
import { EmptyState } from "@/components/marketplace/EmptyState";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import { useNotifications } from "./notifications/useNotifications";
import { incrementProductViews } from "@/integrations/supabase/functions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const MarketplaceContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevant");
  const [currentPage, setCurrentPage] = useState(1);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const {
    currentItems: products,
    totalPages,
    isLoading,
    refetch
  } = useMarketplaceProducts({
    searchQuery,
    industryFilter,
    stageFilter,
    priceFilter,
    timeFilter,
    sortBy,
    currentPage,
    showVerifiedOnly
  });
  
  const {
    notifications,
    unreadCount,
    markAsRead
  } = useNotifications();

  // Track product views
  const trackProductView = async (productId: string) => {
    try {
      await incrementProductViews(productId);
      console.log('Product view tracked:', productId);
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };
  
  // Handle refresh
  const handleRefresh = useCallback(async () => {
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
  }, [refetch]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Switch 
            id="verified-only"
            checked={showVerifiedOnly}
            onCheckedChange={setShowVerifiedOnly}
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
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        industryFilter={industryFilter} 
        setIndustryFilter={setIndustryFilter} 
        stageFilter={stageFilter} 
        setStageFilter={setStageFilter} 
        priceFilter={priceFilter} 
        setPriceFilter={setPriceFilter} 
        timeFilter={timeFilter} 
        setTimeFilter={setTimeFilter} 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
        isLoading={isLoading} 
        notifications={notifications} 
        unreadCount={unreadCount} 
        onMarkAsRead={markAsRead} 
      />

      {isLoading ? 
        <ProductGrid products={[]} isLoading={true} /> 
        : 
        products && products.length > 0 ? 
          <>
            <ProductGrid 
              products={products} 
              isLoading={false} 
              onProductView={trackProductView} 
            />
            <MarketplacePagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              setCurrentPage={setCurrentPage} 
            />
          </> 
          : 
          <EmptyState />
      }
    </>
  );
};
