import { useState } from "react";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { MarketplacePagination } from "@/components/marketplace/MarketplacePagination";
import { EmptyState } from "@/components/marketplace/EmptyState";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { useProducts } from "@/hooks/useProducts";
import { useNotifications } from "./notifications/useNotifications";
import { incrementProductViews } from "@/integrations/supabase/functions";

export const MarketplaceContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevant");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { products, isLoading } = useProducts();
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

  if (products.length === 0 && !isLoading) {
    return <EmptyState />;
  }

  return (
    <>
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
          totalPages={Math.ceil(products.length / 6)}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
};