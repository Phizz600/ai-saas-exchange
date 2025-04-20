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
      // Ensure image_url always has a value
      image_url: product.image_url || product.image || "/placeholder.svg",
      seller: product.seller || {
        id: product.seller_id || "",
        full_name: "Anonymous",
        avatar_url: "/placeholder.svg"
      },
      // Make sure seller_id is included (required by ProductGrid)
      seller_id: product.seller_id || product.seller?.id || "",
      // Ensure all required fields are included with appropriate default values
      active_users: product.active_users || "",
      admin_feedback: product.admin_feedback || "",
      auction_end_time: product.auction_end_time || "", // Ensure auction_end_time is always present
      auction_status: product.auction_status || "",
      business_location: product.business_location || "",
      business_model: product.business_model || "",
      business_type: product.business_type || "",
      category: product.category || "",
      category_other: product.category_other || "",
      competitors: product.competitors || "",
      customer_acquisition_cost: product.customer_acquisition_cost || 0,
      current_price: product.current_price || product.price || 0, // Ensure current_price is always provided
      demo_url: product.demo_url || "",
      deliverables: product.deliverables || [],
      description: product.description || "", // Ensure description is always provided
      gross_profit_margin: product.gross_profit_margin || 0, // Ensure gross_profit_margin is always provided with default 0
      has_patents: product.has_patents || false,
      industry: product.industry || "",
      industry_other: product.industry_other || "",
      integrations: product.integrations || [],
      integrations_other: product.integrations_other || "",
      investment_timeline: product.investment_timeline || "",
      is_verified: product.is_verified || false,
      llm_type: product.llm_type || "",
      llm_type_other: product.llm_type_other || "",
      monetization: product.monetization || "",
      monetization_other: product.monetization_other || "",
      monthly_expenses: product.monthly_expenses || {},
      monthly_profit: product.monthly_profit || 0,
      number_of_employees: product.number_of_employees || "",
      payment_status: product.payment_status || "",
      product_age: product.product_age || "",
      product_link: product.product_link || "",
      reviewed_at: product.reviewed_at || "",
      reviewed_by: product.reviewed_by || "",
      special_notes: product.special_notes || "",
      team_size: product.team_size || "",
      tech_stack: product.tech_stack || [],
      tech_stack_other: product.tech_stack_other || "",
      // Required fields that were previously optional
      created_at: product.created_at || new Date().toISOString(),
      status: product.status || "active",
      updated_at: product.updated_at || new Date().toISOString(),
      highest_bid: product.highest_bid || 0, // Provide a default of 0 if not present
      highest_bidder_id: product.highest_bidder_id || "", // Provide a default empty string if not present
      is_code_audited: product.is_code_audited || false,
      is_revenue_verified: product.is_revenue_verified || false,
      is_traffic_verified: product.is_traffic_verified || false,
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
