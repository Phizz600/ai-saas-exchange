
import { useState, useEffect } from "react";
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
  const [analytics, setAnalytics] = useState<{
    views: number;
    clicks: number;
    saves: number;
  }>({
    views: 0,
    clicks: 0,
    saves: 0
  });

  const {
    data: productDetails
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
    data: bids
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
      setAnalytics(data);
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
      setAnalytics(data);
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [product.id]);

  if (!productDetails) {
    return <Card className="p-6"><div>Loading product details...</div></Card>;
  }

  const isAuction = product.listing_type === 'dutch_auction';

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold exo-2-heading">Product Details</h3>
        {analytics && (analytics.views >= 100 || analytics.clicks >= 50 || analytics.saves >= 25) && (
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 flex items-center gap-1">
            <Flame className="h-4 w-4" />
            Trending
          </Badge>
        )}
      </div>

      <VerificationBadges 
        isRevenueVerified={!!product.is_revenue_verified}
        isCodeAudited={!!product.is_code_audited}
        isTrafficVerified={!!product.is_traffic_verified}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <AuctionDetails product={product} isAuction={isAuction} />
        <ProductOverview product={product} />
        <FinancialMetrics product={product} />
        <TechnicalDetails product={product} />
        <TeamInfo product={product} />
        <MarketPosition competitors={product.competitors} />
        <DescriptionNotes 
          special_notes={product.special_notes} 
          description={product.description}
        />
      </div>
    </Card>
  );
}
