import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Star, Shield, Zap, Building2, Info, Eye, Mouse, Bookmark, Flame, History } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { VerificationBadges } from "./VerificationBadges";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { getProductAnalytics } from "@/integrations/supabase/functions";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  };
}
interface Bid {
  id: string;
  amount: number;
  created_at: string;
  bidder: {
    full_name: string | null;
  };
}
export function ProductStats({
  product
}: ProductStatsProps) {
  const [analytics, setAnalytics] = useState<{
    views: number;
    clicks: number;
    saves: number;
  }>({
    views: 0,
    clicks: 0,
    saves: 0
  });

  // Query to fetch complete product details
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

  // Query to fetch bid history
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

  // Initial fetch of analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      const data = await getProductAnalytics(product.id);
      setAnalytics(data);
    };
    fetchAnalytics();
  }, [product.id]);

  // Subscribe to real-time updates
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

  // If product details haven't loaded yet, show loading state
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
  return <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Critical Buyer Details</h3>
        {isHighTraffic && <Badge variant="secondary" className="bg-amber-100 text-amber-700 flex items-center gap-1">
            <Flame className="h-4 w-4" />
            Trending
          </Badge>}
      </div>

      <VerificationBadges isRevenueVerified={!!product.is_revenue_verified} isCodeAudited={!!product.is_code_audited} isTrafficVerified={!!product.is_traffic_verified} />

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
                <p className="text-lg font-semibold">{analytics?.views || 0}</p>
                <p className="text-sm text-gray-600">Views</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <Mouse className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{analytics?.clicks || 0}</p>
                <p className="text-sm text-gray-600">Clicks</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-pink-100 rounded-full">
                <Bookmark className="h-4 w-4 text-pink-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{analytics?.saves || 0}</p>
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

        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <TrendingUp className="h-4 w-4" />
            <span>Monthly Revenue</span>
          </div>
          <p className="text-lg font-semibold">{formattedRevenue}</p>
          <p className="text-sm text-gray-600">{getRevenueStatus()}</p>
        </div>

        {product.gross_profit_margin !== undefined && <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Info className="h-4 w-4" />
              <span>Gross Profit Margin</span>
            </div>
            <p className="text-lg font-semibold">{product.gross_profit_margin}%</p>
            <p className="text-sm text-gray-600">Based on current operations</p>
          </div>}

        {product.monthly_profit !== undefined && <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Star className="h-4 w-4" />
              <span>Monthly Profit</span>
            </div>
            <p className="text-lg font-semibold">{formatCurrency(product.monthly_profit)}</p>
            <p className="text-sm text-gray-600">Net profit after expenses</p>
          </div>}

        {product.monthly_churn_rate !== undefined && <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Users className="h-4 w-4" />
              <span>Monthly Churn Rate</span>
            </div>
            <p className="text-lg font-semibold">{product.monthly_churn_rate}%</p>
            <p className="text-sm text-gray-600">Customer retention metric</p>
          </div>}

        {product.active_users && <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Users className="h-4 w-4" />
              <span>Active Users</span>
            </div>
            <p className="text-lg font-semibold">{product.active_users}</p>
            <p className="text-sm text-gray-600">Current user base</p>
          </div>}

        {product.monthly_traffic !== undefined && <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Eye className="h-4 w-4" />
              <span>Monthly Traffic</span>
            </div>
            <p className="text-lg font-semibold">{product.monthly_traffic.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Monthly visitors</p>
          </div>}

        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Zap className="h-4 w-4" />
            <span>Tech Stack</span>
          </div>
          <p className="text-lg font-semibold">Technology</p>
          <p className="text-sm text-gray-600">{getTechStack()}</p>
          {product.integrations_other && <p className="text-sm text-gray-600 mt-1">Integrations: {product.integrations_other}</p>}
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Building2 className="h-4 w-4" />
            <span>Team & Location</span>
          </div>
          <p className="text-lg font-semibold">Company Details</p>
          <p className="text-sm text-gray-600">{getTeamComposition()}</p>
          {product.business_location && <p className="text-sm text-gray-600 mt-1">Based in {product.business_location}</p>}
        </div>

        {product.competitors && <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Shield className="h-4 w-4" />
              <span>Competition</span>
            </div>
            <p className="text-lg font-semibold">Market Position</p>
            <p className="text-sm text-gray-600">{product.competitors}</p>
          </div>}

        {product.customer_acquisition_cost !== undefined && <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Users className="h-4 w-4" />
              <span>Customer Acquisition</span>
            </div>
            <p className="text-lg font-semibold">{formatCurrency(product.customer_acquisition_cost)}</p>
            <p className="text-sm text-gray-600">Cost per customer</p>
          </div>}

        {product.monetization && <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Star className="h-4 w-4" />
              <span>Monetization Strategy</span>
            </div>
            <p className="text-lg font-semibold">
              {product.monetization_other || product.monetization.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </p>
          </div>}

        {product.product_age && <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <History className="h-4 w-4" />
              <span>Product Age</span>
            </div>
            <p className="text-lg font-semibold">{product.product_age}</p>
          </div>}

        {product.special_notes && <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Star className="h-4 w-4" />
              <span></span>
            </div>
            <p className="text-lg font-semibold"></p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {product.special_notes}
            </p>
          </div>}
      </div>
    </Card>;
}