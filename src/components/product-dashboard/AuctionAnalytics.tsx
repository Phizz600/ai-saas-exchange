
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, BarChart3, TrendingUp, Timer } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AuctionAnalyticsProps {
  productId?: string;
}

// Add type definitions for our data
interface BidderProfile {
  full_name: string | null;
}

interface BidData {
  id: string;
  amount: number;
  created_at: string;
  status: string;
  payment_status: string;
  bidder_id: string;
  bidder: BidderProfile | null;
}

interface AnalyticsData {
  date: string;
  views: number;
  clicks: number;
}

interface PriceHistoryData {
  price: number;
  created_at: string;
  type: string;
}

export const AuctionAnalytics = ({ productId }: AuctionAnalyticsProps) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const { toast } = useToast();

  // Fetch auction data including bids and views
  const { data: auctionData, isLoading: isLoadingAuction } = useQuery({
    queryKey: ['auction-analytics', productId, timeRange],
    queryFn: async () => {
      if (!productId) return null;

      // Get the product details
      const { data: product, error: productError } = await supabase
        .from('products')
        .select(`
          id,
          title,
          current_price,
          starting_price,
          min_price,
          highest_bid,
          auction_end_time,
          created_at
        `)
        .eq('id', productId)
        .single();

      if (productError) {
        console.error('Error fetching product:', productError);
        throw productError;
      }

      if (!product.auction_end_time) {
        // Not an auction product
        return null;
      }

      // Calculate date range based on timeRange
      const now = new Date();
      let startDate;
      switch (timeRange) {
        case '24h':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      // Get all bids for this product within the time range
      const { data: bids, error: bidsError } = await supabase
        .from('bids')
        .select(`
          id,
          amount,
          created_at,
          status,
          payment_status,
          bidder_id,
          bidder:profiles!bids_bidder_id_fkey(full_name)
        `)
        .eq('product_id', productId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (bidsError) {
        console.error('Error fetching bids:', bidsError);
        throw bidsError;
      }

      // Get view analytics for this product within the time range
      const { data: analytics, error: analyticsError } = await supabase
        .from('product_analytics')
        .select('date, views, clicks')
        .eq('product_id', productId)
        .gte('date', startDate.toISOString().split('T')[0]);

      if (analyticsError) {
        console.error('Error fetching analytics:', analyticsError);
        throw analyticsError;
      }

      // Get price history for chart
      const { data: priceHistory, error: priceHistoryError } = await supabase
        .from('price_history')
        .select('price, created_at, type')
        .eq('product_id', productId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (priceHistoryError) {
        console.error('Error fetching price history:', priceHistoryError);
      }

      // We need to transform the data to match our interfaces
      const transformedBids = bids ? bids.map((bid: any) => ({
        id: bid.id,
        amount: bid.amount,
        created_at: bid.created_at,
        status: bid.status,
        payment_status: bid.payment_status,
        bidder_id: bid.bidder_id,
        bidder: bid.bidder ? { full_name: bid.bidder.full_name } : null
      })) : [];

      return {
        product,
        bids: transformedBids as BidData[],
        analytics: analytics as AnalyticsData[],
        priceHistory: (priceHistory || []) as PriceHistoryData[]
      };
    },
    enabled: !!productId,
  });

  if (isLoadingAuction) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!auctionData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auction Analytics</CardTitle>
          <CardDescription>This product is not an auction listing</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { product, bids, analytics, priceHistory } = auctionData;

  // Filter out cancelled and unauthorized bids for display
  const validBids = bids.filter(bid => 
    bid.status === 'active' && 
    bid.payment_status === 'authorized'
  );

  // Format analytics data for charts
  const analyticsData = analytics.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    views: day.views || 0,
    clicks: day.clicks || 0,
    bidCount: validBids.filter(bid => 
      new Date(bid.created_at).toISOString().split('T')[0] === day.date
    ).length
  }));

  // Format bid data for charts
  const bidChartData = validBids.map(bid => ({
    time: new Date(bid.created_at).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    amount: bid.amount,
    bidder: bid.bidder?.full_name ? bid.bidder.full_name.charAt(0) + '***' : 'Anonymous'
  }));

  // Format price history for chart
  const priceData = priceHistory.map(record => ({
    time: new Date(record.created_at).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    price: record.price,
    type: record.type
  }));

  // Calculate conversion rate: bids / views
  const totalViews = analytics.reduce((sum, day) => sum + (day.views || 0), 0);
  const totalBids = validBids.length;
  const conversionRate = totalViews > 0 ? (totalBids / totalViews * 100).toFixed(2) : 0;

  // Calculate auction end time or time left
  const auctionEndTime = new Date(product.auction_end_time);
  const now = new Date();
  const isAuctionEnded = auctionEndTime < now;
  
  let timeLeft = '';
  if (!isAuctionEnded) {
    const diff = auctionEndTime.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    timeLeft = `${days}d ${hours}h ${minutes}m`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold exo-2-header">Auction Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Track your auction progress and performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant={timeRange === '24h' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('24h')}
          >
            24h
          </Button>
          <Button 
            variant={timeRange === '7d' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7d
          </Button>
          <Button 
            variant={timeRange === '30d' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30d
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Current Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(product.current_price || product.starting_price)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Started at {formatCurrency(product.starting_price)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Bids
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {validBids.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Highest: {formatCurrency(product.highest_bid || 0)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversionRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalBids} bids / {totalViews} views
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {isAuctionEnded ? 'Auction Ended' : 'Time Remaining'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {isAuctionEnded ? (
                'Ended'
              ) : (
                <>
                  <Timer className="h-5 w-5 mr-2 text-amber-500" />
                  {timeLeft}
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isAuctionEnded 
                ? `Ended on ${auctionEndTime.toLocaleDateString()}` 
                : `Ends on ${auctionEndTime.toLocaleDateString()}`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bids" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bids" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Bid History
          </TabsTrigger>
          <TabsTrigger value="views" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Views & Engagement
          </TabsTrigger>
          <TabsTrigger value="price" className="flex items-center gap-2">
            {/* Use an SVG for the chart icon instead of the LineChart component */}
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"></path>
              <path d="m19 9-5 5-4-4-3 3"></path>
            </svg>
            Price Tracking
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="bids" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bid History</CardTitle>
              <CardDescription>
                Track the history of bids on your auction
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {bidChartData.length > 0 ? (
                <ChartContainer
                  config={{
                    amount: {
                      label: "Bid Amount",
                      color: "#8B5CF6",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bidChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="time" 
                        fontSize={12}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${value}`}
                        fontSize={12}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <Tooltip 
                        content={
                          ({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Bidder
                                      </span>
                                      <span className="font-bold text-sm">
                                        {payload[0].payload.bidder}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Amount
                                      </span>
                                      <span className="font-bold text-sm">
                                        {typeof payload[0].value === 'number' 
                                          ? formatCurrency(payload[0].value) 
                                          : payload[0].value}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }
                        }
                      />
                      <Bar dataKey="amount" fill="var(--color-amount)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">No bid data available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Bid Timeline</CardTitle>
              <CardDescription>Recent bids with bidder information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {validBids.length > 0 ? (
                  validBids.slice(0, 5).map((bid, index) => (
                    <div 
                      key={bid.id}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div>
                          <p className="font-medium">
                            {bid.bidder?.full_name ? (
                              `${bid.bidder.full_name.charAt(0)}${'*'.repeat(bid.bidder.full_name.length > 5 ? 5 : bid.bidder.full_name.length - 1)}`
                            ) : 'Anonymous Bidder'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(bid.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold">{formatCurrency(bid.amount)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No bids have been placed yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="views" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Views vs. Bids</CardTitle>
              <CardDescription>
                Compare product views against bid activity
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {analyticsData.length > 0 ? (
                <ChartContainer
                  config={{
                    views: {
                      label: "Views",
                      color: "#0EA4E9",
                    },
                    bidCount: {
                      label: "Bids",
                      color: "#8B5CF6",
                    }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        fontSize={12}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <YAxis 
                        fontSize={12}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="views" 
                        fill="var(--color-views)" 
                        stroke="var(--color-views)"
                        fillOpacity={0.3}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="bidCount" 
                        fill="var(--color-bidCount)" 
                        stroke="var(--color-bidCount)"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">No analytics data available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>Key performance indicators for your auction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{totalViews}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Total Bids</p>
                  <p className="text-2xl font-bold">{totalBids}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">View-to-Bid Rate</p>
                  <p className="text-2xl font-bold">{conversionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="price" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price History</CardTitle>
              <CardDescription>
                Track how the price has changed over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {priceData.length > 0 ? (
                <ChartContainer
                  config={{
                    price: {
                      label: "Price",
                      color: "#D946EE",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="time" 
                        fontSize={12}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${value}`}
                        fontSize={12}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <Tooltip 
                        content={
                          ({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Time
                                      </span>
                                      <span className="font-bold text-sm">
                                        {payload[0].payload.time}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Price
                                      </span>
                                      <span className="font-bold text-sm">
                                        {typeof payload[0].value === 'number' 
                                          ? formatCurrency(payload[0].value) 
                                          : payload[0].value}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }
                        }
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="var(--color-price)" 
                        strokeWidth={2}
                        dot={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">No price history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
