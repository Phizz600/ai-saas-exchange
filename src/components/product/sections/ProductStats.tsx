
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, Users, Star, Shield, Zap, Building2, Info, Eye, 
  Mouse, Bookmark, Flame, History, Code2, Network, Target,
  Calendar, DollarSign, BarChart3, GitBranch, BookOpen,
  GanttChart, Globe2, Microscope, HeartHandshake, Building,
  FolderGit2, MessageSquareMore, ShieldCheck, Settings, Link
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { VerificationBadges } from "./VerificationBadges";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { getProductAnalytics } from "@/integrations/supabase/functions";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Bid {
  id: string;
  amount: number;
  created_at: string;
  bidder: {
    full_name: string | null;
  };
}

interface ProductStatsProps {
  product: {
    id: string;
    seller: {
      full_name: string | null;
    };
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
      return data as unknown as Bid[];
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

  const isHighTraffic = analytics && (analytics.views >= 100 || analytics.clicks >= 50 || analytics.saves >= 25);
  const formattedRevenue = product.monthly_revenue ? formatCurrency(product.monthly_revenue) : '$0';
  const formattedProfit = product.monthly_profit ? formatCurrency(product.monthly_profit) : 'Not disclosed';

  const getRevenueStatus = () => {
    if (!product.monthly_revenue || product.monthly_revenue === 0) {
      return `Beta: Revenue starts ${product.stage === 'MVP' ? 'Q3 2024' : 'Q3 2025'}`;
    }
    return `Monthly Profit: ${formattedProfit}`;
  };

  const getTechStack = () => {
    if (product.tech_stack_other) {
      return product.tech_stack_other;
    }
    return product.tech_stack && product.tech_stack.length > 0 ? `Built with ${product.tech_stack.join(', ')}` : "Tech stack details coming soon";
  };

  const getTeamComposition = () => {
    return product.team_size ? `Core Team: ${product.team_size}` : "Team details coming soon";
  };

  const formatBidderName = (fullName: string | null) => {
    if (!fullName) return "Anonymous";
    const nameParts = fullName.split(' ');
    if (nameParts.length === 0) return "Anonymous";
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}****`;
  };

  const lastBid = bids && bids.length > 0 ? bids[0] : null;

  const getLLMInfo = () => {
    if (product.llm_type_other) {
      return product.llm_type_other;
    }
    return product.llm_type || "LLM details coming soon";
  };

  const isAuction = product.listing_type === 'dutch_auction';

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold exo-2-heading">Product Details</h3>
        {isHighTraffic && <Badge variant="secondary" className="bg-amber-100 text-amber-700 flex items-center gap-1">
            <Flame className="h-4 w-4" />
            Trending
          </Badge>}
      </div>

      <VerificationBadges 
        isRevenueVerified={!!product.is_revenue_verified}
        isCodeAudited={!!product.is_code_audited}
        isTrafficVerified={!!product.is_traffic_verified}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Auction Details - Only show if listing is auction type */}
        {isAuction && (
          <div className="col-span-full">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span>Auction Details</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between items-center bg-white p-2 rounded-md">
                  <span className="text-gray-600">Starting Price</span>
                  <span className="font-medium">{product.starting_price ? formatCurrency(product.starting_price) : "Not set"}</span>
                </div>
                {product.no_reserve ? (
                  <div className="flex justify-between items-center bg-green-50 p-2 rounded-md">
                    <span className="text-gray-600">Reserve Price</span>
                    <span className="font-medium text-green-600">No Reserve</span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-white p-2 rounded-md">
                    <span className="text-gray-600">Reserve Price</span>
                    <span className="font-medium">{product.reserve_price ? formatCurrency(product.reserve_price) : "Not set"}</span>
                  </div>
                )}
                <div className="flex justify-between items-center bg-white p-2 rounded-md">
                  <span className="text-gray-600">Price Decrement</span>
                  <span className="font-medium">{product.price_decrement ? formatCurrency(product.price_decrement) : "Not set"}</span>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded-md">
                  <span className="text-gray-600">Decrement Interval</span>
                  <span className="font-medium">{product.price_decrement_interval || "Not set"}</span>
                </div>
                {product.auction_end_time && (
                  <div className="flex justify-between items-center bg-white p-2 rounded-md col-span-full">
                    <span className="text-gray-600">Auction End Time</span>
                    <span className="font-medium">{new Date(product.auction_end_time).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center bg-white p-2 rounded-md col-span-full">
                  <span className="text-gray-600">Current Price</span>
                  <span className="font-medium text-green-600">{product.current_price ? formatCurrency(product.current_price) : "Not set"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Overview Section */}
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
                  <Globe2 className="h-4 w-4" />
                  View Live Demo
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Financial Metrics */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <DollarSign className="h-4 w-4" />
            <span>Financial Overview</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Monthly Revenue</span>
              <span className="font-medium">{product.monthly_revenue ? formatCurrency(product.monthly_revenue) : "Not disclosed"}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Monthly Profit</span>
              <span className="font-medium">{product.monthly_profit ? formatCurrency(product.monthly_profit) : "Not disclosed"}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Gross Profit Margin</span>
              <span className="font-medium">{product.gross_profit_margin ? `${product.gross_profit_margin}%` : "Not disclosed"}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Customer Acquisition Cost</span>
              <span className="font-medium">{product.customer_acquisition_cost ? formatCurrency(product.customer_acquisition_cost) : "Not disclosed"}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Monetization</span>
              <span className="font-medium">{product.monetization || product.monetization_other || "Not specified"}</span>
            </div>
          </div>
        </div>

        {/* User Metrics */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Users className="h-4 w-4" />
            <span>User Metrics</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Monthly Traffic</span>
              <span className="font-medium">{product.monthly_traffic?.toLocaleString() || "Not disclosed"}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Active Users</span>
              <span className="font-medium">{product.active_users || "Not disclosed"}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Monthly Churn Rate</span>
              <span className="font-medium">{product.monthly_churn_rate ? `${product.monthly_churn_rate}%` : "Not disclosed"}</span>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Code2 className="h-4 w-4" />
            <span>Technical Stack</span>
          </div>
          <div className="space-y-3">
            {product.tech_stack && product.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tech_stack.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
            {product.tech_stack_other && (
              <div className="text-gray-600 mt-2">
                Additional tech: {product.tech_stack_other}
              </div>
            )}
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">LLM Type</span>
              <span className="font-medium">{product.llm_type || product.llm_type_other || "Not specified"}</span>
            </div>
            {product.integrations && product.integrations.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Integrations:</p>
                <div className="flex flex-wrap gap-2">
                  {product.integrations.map((integration, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                      {integration}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {product.integrations_other && (
              <div className="text-gray-600 mt-2">
                Additional integrations: {product.integrations_other}
              </div>
            )}
            {product.has_patents && (
              <div className="flex items-center gap-2 text-emerald-600 mt-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Patents Protected</span>
              </div>
            )}
          </div>
        </div>

        {/* Team & Location */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Users className="h-4 w-4" />
            <span>Team Information</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Team Size</span>
              <span className="font-medium">{product.team_size || "Not specified"}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Number of Employees</span>
              <span className="font-medium">{product.number_of_employees || "Not specified"}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
              <span className="text-gray-600">Business Location</span>
              <span className="font-medium">{product.business_location || "Not specified"}</span>
            </div>
          </div>
        </div>

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

        {/* Investment Timeline */}
        {product.investment_timeline && (
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Calendar className="h-4 w-4" />
              <span>Investment Timeline</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                <span className="text-gray-600">Timeline</span>
                <span className="font-medium">{product.investment_timeline}</span>
              </div>
            </div>
          </div>
        )}

        {/* Deliverables */}
        {product.deliverables && product.deliverables.length > 0 && (
          <div className="col-span-full">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <BookOpen className="h-4 w-4" />
              <span>Included Deliverables</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.deliverables.map((deliverable, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                  {deliverable}
                </Badge>
              ))}
            </div>
          </div>
        )}

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
        
        {/* Description (in full) */}
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
