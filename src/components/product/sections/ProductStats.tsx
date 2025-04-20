import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, Users, Star, Shield, Zap, Building2, Info, Eye, 
  Mouse, Bookmark, Flame, History, Code2, Network, Target,
  Calendar, DollarSign, BarChart3, GitBranch, BookOpen
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

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Critical Buyer Details</h3>
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
        <div className="col-span-full bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-gray-600">Last 24 Hours Activity</h4>
            {bids && bids.length > 0 && <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-sm text-blue-600 hover:text-blue-700">
                    <History className="h-4 w-4 mr-1" />
                    View All Bids
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Complete Bid History</SheetTitle>
                    <SheetDescription>
                      All bids placed on this product
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {bids.map(bid => <div key={bid.id} className="border-b border-gray-200 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{formatCurrency(bid.amount)}</p>
                            <p className="text-sm text-gray-600">by {formatBidderName(bid.bidder.full_name)}</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            {format(new Date(bid.created_at), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                      </div>)}
                  </div>
                </SheetContent>
              </Sheet>}
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="text-lg font-semibold">{analytics?.views || 0}</p>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white shadow-lg">
                      <p>Views are tracked when this product appears on the marketplace grid</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-sm text-gray-600">Views</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <Mouse className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="text-lg font-semibold">{analytics?.clicks || 0}</p>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white shadow-lg">
                      <p>Clicks are tracked when a user navigates to the product details page</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-sm text-gray-600">Clicks</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-pink-100 rounded-full">
                <Bookmark className="h-4 w-4 text-pink-600" />
              </div>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="text-lg font-semibold">{analytics?.saves || 0}</p>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white shadow-lg">
                      <p>Saves are tracked when a user adds this product to their saved list</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p className="text-sm text-gray-600">Saves</p>
              </div>
            </div>
          </div>
          
          {lastBid && <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Latest Bid</p>
                  <p className="text-sm text-gray-600">
                    by {formatBidderName(lastBid.bidder.full_name)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(lastBid.amount)}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(lastBid.created_at), 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            </div>}
        </div>

        {/* Financial Metrics */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <DollarSign className="h-4 w-4" />
            <span>Financial Overview</span>
          </div>
          <div className="space-y-3">
            {product.monthly_revenue !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Revenue</span>
                <span className="font-medium">{formatCurrency(product.monthly_revenue)}</span>
              </div>
            )}
            {product.monthly_profit !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Profit</span>
                <span className="font-medium">{formatCurrency(product.monthly_profit)}</span>
              </div>
            )}
            {product.gross_profit_margin !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Gross Profit Margin</span>
                <span className="font-medium">{product.gross_profit_margin}%</span>
              </div>
            )}
            {product.customer_acquisition_cost !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customer Acquisition Cost</span>
                <span className="font-medium">{formatCurrency(product.customer_acquisition_cost)}</span>
              </div>
            )}
          </div>
        </div>

        {/* User Metrics */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Users className="h-4 w-4" />
            <span>User Metrics</span>
          </div>
          <div className="space-y-3">
            {product.monthly_traffic !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Traffic</span>
                <span className="font-medium">{product.monthly_traffic.toLocaleString()}</span>
              </div>
            )}
            {product.active_users && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Users</span>
                <span className="font-medium">{product.active_users}</span>
              </div>
            )}
            {product.monthly_churn_rate !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Churn Rate</span>
                <span className="font-medium">{product.monthly_churn_rate}%</span>
              </div>
            )}
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
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            )}
            {product.tech_stack_other && (
              <div className="text-gray-600">
                Additional tech: {product.tech_stack_other}
              </div>
            )}
            {product.llm_type && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">LLM Type</span>
                <span className="font-medium">{product.llm_type}</span>
              </div>
            )}
          </div>
        </div>

        {/* Business Details */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Building2 className="h-4 w-4" />
            <span>Business Information</span>
          </div>
          <div className="space-y-3">
            {product.business_type && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Business Type</span>
                <span className="font-medium">{product.business_type}</span>
              </div>
            )}
            {product.business_model && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Business Model</span>
                <span className="font-medium">{product.business_model}</span>
              </div>
            )}
            {product.monetization && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monetization</span>
                <span className="font-medium">
                  {product.monetization_other || product.monetization}
                </span>
              </div>
            )}
            {product.product_age && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Product Age</span>
                <span className="font-medium">{product.product_age}</span>
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
            {product.team_size && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Team Size</span>
                <span className="font-medium">{product.team_size}</span>
              </div>
            )}
            {product.number_of_employees && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Number of Employees</span>
                <span className="font-medium">{product.number_of_employees}</span>
              </div>
            )}
            {product.business_location && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Business Location</span>
                <span className="font-medium">{product.business_location}</span>
              </div>
            )}
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
                <span className="font-medium">{product.competitors}</span>
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
              <div className="flex justify-between items-center">
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
                <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm">
                  {deliverable}
                </span>
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
            <p className="text-gray-600 whitespace-pre-wrap">{product.special_notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
