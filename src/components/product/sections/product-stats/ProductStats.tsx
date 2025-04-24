import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { getProductAnalytics } from "@/integrations/supabase/functions";
import { AuctionDetails } from "./AuctionDetails";
import { FinancialMetrics } from "./FinancialMetrics";
import { TechnicalDetails } from "./TechnicalDetails";
import { TeamInfo } from "./TeamInfo";
import { VerificationBadges } from "../VerificationBadges";
import { ProductOverview } from "./ProductOverview";
import { MarketPosition } from "./MarketPosition";
import { DescriptionNotes } from "./DescriptionNotes";
import { AssetsDeliverables } from "./AssetsDeliverables";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SimpleAnalytics, convertToSimpleAnalytics } from "@/utils/analytics";

interface ProductStatsProps {
  product: {
    id: string;
    seller: {
      full_name: string | null;
    };
    title?: string;
    description?: string;
    listing_type?: string;
    auction_end_time?: string;
    starting_price?: number;
    reserve_price?: number;
    price_decrement?: number;
    price_decrement_interval?: string;
    no_reserve?: boolean;
    current_price?: number;
    monthly_revenue?: number;
    monthly_profit?: number;
    gross_profit_margin?: number;
    monthly_churn_rate?: number;
    monthly_traffic?: string | number; // Updated to accept both string and number
    active_users?: string;
    tech_stack?: string[];
    tech_stack_other?: string;
    llm_type?: string;
    llm_type_other?: string;
    integrations?: string[];
    integrations_other?: string;
    team_size?: string;
    business_location?: string;
    competitors?: string;
    customer_acquisition_cost?: number;
    monetization?: string;
    monetization_other?: string;
    product_age?: string;
    special_notes?: string;
    stage?: string;
    is_revenue_verified?: boolean;
    is_code_audited?: boolean;
    is_traffic_verified?: boolean;
    business_model?: string;
    investment_timeline?: string;
    number_of_employees?: string;
    business_type?: string;
    deliverables?: string[];
    category?: string;
    category_other?: string;
    industry?: string;
    industry_other?: string;
    demo_url?: string;
    has_patents?: boolean;
    product_link?: string;
    monthly_expenses?: Array<{
      id: string;
      name: string;
      amount: number;
      category: string;
    }>;
  };
}

export function ProductStats({ product }: ProductStatsProps) {
  const [analytics, setAnalytics] = useState<SimpleAnalytics>({
    views: 0,
    clicks: 0,
    saves: 0
  });

  const {
    data: productDetails,
    isLoading: isLoadingDetails
  } = useQuery({
    queryKey: ['product-details', product.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('products').select(`
          *,
          seller:profiles(full_name)
        `).eq('id', product.id).single();
      if (error) throw error;
      return data;
    }
  });

  const {
    data: bids,
    isLoading: isLoadingBids
  } = useQuery({
    queryKey: ['bids', product.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('bids').select(`
          id,
          amount,
          created_at,
          bidder:profiles(full_name)
        `).eq('product_id', product.id).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      const data = await getProductAnalytics(product.id);
      // Use our conversion utility to handle any analytics format
      setAnalytics(convertToSimpleAnalytics(data));
    };
    fetchAnalytics();
  }, [product.id]);

  useEffect(() => {
    const channel = supabase.channel('analytics-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'product_analytics',
      filter: `product_id=eq.${product.id}`
    }, async payload => {
      console.log('Received real-time update:', payload);
      const data = await getProductAnalytics(product.id);
      // Use our conversion utility to handle any analytics format
      setAnalytics(convertToSimpleAnalytics(data));
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [product.id]);

  // Add real-time subscription to product changes
  useEffect(() => {
    const productChannel = supabase.channel('product-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'products',
      filter: `id=eq.${product.id}`
    }, async () => {
      console.log('Product details updated, refreshing data');
      // This will trigger the useQuery to refetch
      window.dispatchEvent(new CustomEvent('refetch-product-details'));
    }).subscribe();
    
    return () => {
      supabase.removeChannel(productChannel);
    };
  }, [product.id]);

  if (isLoadingDetails) {
    return <Card className="p-6"><div>Loading product details...</div></Card>;
  }

  const isAuction = product.listing_type === 'dutch_auction';
  const mergedProduct = { ...product, ...productDetails };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold exo-2-heading bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-transparent">
          Product Details
        </h3>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                {analytics && (analytics.views >= 100 || analytics.clicks >= 50 || analytics.saves >= 25) && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 flex items-center gap-1">
                    <Flame className="h-4 w-4" />
                    Trending
                  </Badge>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                This product is trending with high engagement metrics
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <VerificationBadges 
        isRevenueVerified={!!product.is_revenue_verified}
        isCodeAudited={!!product.is_code_audited}
        isTrafficVerified={!!product.is_traffic_verified}
      />

      {isAuction && (
        <div className="mt-6">
          <AuctionDetails product={mergedProduct} isAuction={isAuction} />
        </div>
      )}

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="w-full border-b mb-4 pb-1 overflow-x-auto flex flex-nowrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="team">Team & Location</TabsTrigger>
          <TabsTrigger value="assets">Assets & Deliverables</TabsTrigger>
          <TabsTrigger value="description">Description & Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductOverview product={mergedProduct} />
            <MarketPosition competitors={mergedProduct.competitors} />
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            <FinancialMetrics product={mergedProduct} />
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            <TechnicalDetails product={mergedProduct} />
          </div>
        </TabsContent>
        
        <TabsContent value="team" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            <TeamInfo product={mergedProduct} />
          </div>
        </TabsContent>
        
        <TabsContent value="assets" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            <AssetsDeliverables deliverables={mergedProduct.deliverables} />
          </div>
        </TabsContent>
        
        <TabsContent value="description" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            <DescriptionNotes 
              special_notes={mergedProduct.special_notes} 
              description={mergedProduct.description}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
