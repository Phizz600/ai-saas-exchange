import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Target, Info, MessageSquareMore, Flame, Globe, Link } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { getProductAnalytics } from "@/integrations/supabase/functions";
import { AuctionDetails } from "./product-stats/AuctionDetails";
import { FinancialMetrics } from "./product-stats/FinancialMetrics";
import { TechnicalDetails } from "./product-stats/TechnicalDetails";
import { TeamInfo } from "./product-stats/TeamInfo";
import { VerificationBadges } from "./VerificationBadges";

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
    monthly_traffic?: number;
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
        
        {/* Product Overview */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Info className="h-4 w-4" />
            <span>Product Overview</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Product Name</span>
              <span className="font-medium">{product.title || productDetails.title}</span>
            </div>
            {product.product_link && (
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                <span className="text-gray-600">Product Link</span>
                <a href={product.product_link} target="_blank" rel="noopener noreferrer" 
                   className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  Visit <Link className="h-3 w-3" />
                </a>
              </div>
            )}
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Category</span>
              <span className="font-medium">{product.category}</span>
            </div>
            {product.category_other && (
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                <span className="text-gray-600">Category Details</span>
                <span className="font-medium">{product.category_other}</span>
              </div>
            )}
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Industry</span>
              <span className="font-medium">{product.industry || "Not specified"}</span>
            </div>
            {product.industry_other && (
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                <span className="text-gray-600">Industry Details</span>
                <span className="font-medium">{product.industry_other}</span>
              </div>
            )}
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Stage</span>
              <span className="font-medium">{product.stage}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Business Type</span>
              <span className="font-medium">{product.business_type || "Not specified"}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Business Model</span>
              <span className="font-medium">{product.business_model || "Not specified"}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Product Age</span>
              <span className="font-medium">{product.product_age || "Not specified"}</span>
            </div>
            {product.demo_url && (
              <div className="mt-4">
                <a 
                  href={product.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 text-[#8B5CF6] border border-[#8B5CF6] rounded-md hover:bg-[#8B5CF6]/10 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  View Live Demo
                </a>
              </div>
            )}
          </div>
        </div>

        <FinancialMetrics product={product} />
        <TechnicalDetails product={product} />
        <TeamInfo product={product} />

        {/* Market & Competition */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Target className="h-4 w-4" />
            <span>Market Position</span>
          </div>
          <div className="space-y-3">
            {product.competitors && (
              <div>
                <span className="text-gray-600 block mb-1">Competition</span>
                <p className="text-sm bg-gray-50 p-2 rounded-md">{product.competitors}</p>
              </div>
            )}
          </div>
        </div>

        {/* Special Notes */}
        {product.special_notes && (
          <div className="col-span-full">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Info className="h-4 w-4" />
              <span>Special Notes</span>
            </div>
            <p className="text-gray-600 whitespace-pre-wrap p-3 bg-gray-50 rounded-md">{product.special_notes}</p>
          </div>
        )}
        
        {/* Description */}
        {product.description && (
          <div className="col-span-full">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MessageSquareMore className="h-4 w-4" />
              <span>Full Description</span>
            </div>
            <p className="text-gray-600 whitespace-pre-wrap p-3 bg-gray-50 rounded-md">{product.description}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
