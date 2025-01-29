import { useState } from "react";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { MarketplacePagination } from "@/components/marketplace/MarketplacePagination";
import { EmptyState } from "@/components/marketplace/EmptyState";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { useProducts } from "@/hooks/useProducts";
import { useNotifications } from "../marketplace/notifications/useNotifications";
import { incrementProductViews } from "@/integrations/supabase/functions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ProductDashboardContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevant");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: products = [], isLoading } = useProducts();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { toast } = useToast();

  // Track product views
  const trackProductView = async (productId: string) => {
    try {
      await incrementProductViews(productId);
      console.log('Product view tracked:', productId);
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };

  const handlePauseProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'paused' })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Product paused",
        description: "Your product has been paused and is no longer visible in the marketplace",
      });
    } catch (error) {
      console.error('Error pausing product:', error);
      toast({
        title: "Error",
        description: "Failed to pause product. Please try again.",
        variant: "destructive",
      });
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
        onPauseProduct={handlePauseProduct}
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