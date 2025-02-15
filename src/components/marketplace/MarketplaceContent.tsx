
import { useState } from "react";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { MarketplacePagination } from "@/components/marketplace/MarketplacePagination";
import { EmptyState } from "@/components/marketplace/EmptyState";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import { useNotifications } from "./notifications/useNotifications";
import { incrementProductViews } from "@/integrations/supabase/functions";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export const MarketplaceContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevant");
  const [currentPage, setCurrentPage] = useState(1);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  
  const { currentItems: products, totalPages, isLoading } = useMarketplaceProducts({
    searchQuery,
    industryFilter,
    stageFilter,
    priceFilter,
    timeFilter,
    sortBy,
    currentPage,
    showVerifiedOnly
  });
  
  const { notifications, unreadCount, markAsRead } = useNotifications();

  // Track product views
  const trackProductView = async (productId: string) => {
    try {
      await incrementProductViews(productId);
      console.log('Product view tracked:', productId);
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };

  if (isLoading) {
    return <ProductGrid products={[]} isLoading={true} />;
  }

  if (!products || products.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
          className={`flex items-center gap-2 ${showVerifiedOnly ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
        >
          <CheckCircle className="h-4 w-4" />
          Show Verified Only
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

      <ProductGrid 
        products={products} 
        isLoading={isLoading} 
        onProductView={trackProductView}
      />

      {!isLoading && products.length > 0 && (
        <MarketplacePagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
};
