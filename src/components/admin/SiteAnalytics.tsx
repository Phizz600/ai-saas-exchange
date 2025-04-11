
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, TrendingUp, Users, ShoppingCart, Search, ArrowUpRight } from "lucide-react";

export const SiteAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const COLORS = ['#D946EE', '#8B5CF6', '#0EA4E9', '#10B981', '#F59E0B'];

  useEffect(() => {
    const fetchSiteAnalytics = async () => {
      setLoading(true);
      try {
        // Fetch product analytics data
        const { data: productAnalytics, error: analyticsError } = await supabase
          .from('product_analytics')
          .select('*')
          .order('date', { ascending: false })
          .limit(90); // Get up to 3 months of data

        if (analyticsError) throw analyticsError;
        
        // Fetch product data to analyze listings
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id, created_at, status, category, price, highest_bid');
          
        if (productsError) throw productsError;
        
        // Fetch user profiles data to analyze growth
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, created_at, user_type');
          
        if (profilesError) throw profilesError;
        
        // Fetch bid data for conversion metrics
        const { data: bids, error: bidsError } = await supabase
          .from('bids')
          .select('id, created_at, product_id, status, amount');
          
        if (bidsError) throw bidsError;
        
        // Process the data
        const processedData = processAnalyticsData(
          productAnalytics || [],
          products || [],
          profiles || [],
          bids || [],
          timeframe
        );
        
        setAnalyticsData(processedData);
      } catch (error) {
        console.error('Error fetching site analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteAnalytics();
  }, [timeframe]);

  const processAnalyticsData = (
    analytics: any[], 
    products: any[], 
    profiles: any[], 
    bids: any[],
    timeframe: string
  ) => {
    // Define date range based on timeframe
    const now = new Date();
    const startDate = new Date();
    
    switch(timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    // Filter data based on timeframe
    const filteredAnalytics = analytics.filter(a => 
      new Date(a.date) >= startDate && new Date(a.date) <= now
    );
    
    const filteredProducts = products.filter(p => 
      new Date(p.created_at) >= startDate && new Date(p.created_at) <= now
    );
    
    const filteredProfiles = profiles.filter(p => 
      new Date(p.created_at) >= startDate && new Date(p.created_at) <= now
    );
    
    const filteredBids = bids.filter(b => 
      new Date(b.created_at) >= startDate && new Date(b.created_at) <= now
    );
    
    // Aggregate traffic data by date
    const trafficByDate = aggregateDataByDate(filteredAnalytics, 'date', 'views');
    
    // Aggregate conversions (clicks to views ratio)
    const conversionRateByDate = filteredAnalytics.map(day => {
      const viewCount = day.views || 0;
      const clickCount = day.clicks || 0;
      const conversionRate = viewCount > 0 ? (clickCount / viewCount) * 100 : 0;
      
      return {
        date: day.date,
        rate: parseFloat(conversionRate.toFixed(1))
      };
    });
    
    // Group products by category
    const productsByCategory: {[key: string]: number} = {};
    filteredProducts.forEach(p => {
      const category = p.category || 'Uncategorized';
      productsByCategory[category] = (productsByCategory[category] || 0) + 1;
    });
    
    const categoryData = Object.entries(productsByCategory).map(([name, value]) => ({
      name,
      value
    }));
    
    // Calculate user growth
    const userGrowth = calcUserGrowth(filteredProfiles, timeframe);
    
    // Calculate overall engagement metrics
    const totalViews = filteredAnalytics.reduce((sum, day) => sum + (day.views || 0), 0);
    const totalClicks = filteredAnalytics.reduce((sum, day) => sum + (day.clicks || 0), 0);
    const totalSaves = filteredAnalytics.reduce((sum, day) => sum + (day.saves || 0), 0);
    const totalBids = filteredAnalytics.reduce((sum, day) => sum + (day.bids || 0), 0);
    const totalProducts = filteredProducts.length;
    const totalUsers = filteredProfiles.length;
    
    // Calculate conversion funnel
    const viewToClickRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
    const clickToBidRate = totalClicks > 0 ? (totalBids / totalClicks) * 100 : 0;
    const overallConversionRate = totalViews > 0 ? (totalBids / totalViews) * 100 : 0;
    
    // Calculate average product price
    const avgPrice = filteredProducts.length > 0 
      ? filteredProducts.reduce((sum, p) => sum + (p.price || 0), 0) / filteredProducts.length
      : 0;
    
    // Calculate active listings
    const activeListings = filteredProducts.filter(p => p.status === 'active').length;
    const pendingListings = filteredProducts.filter(p => p.status === 'pending').length;
    const successfulTransactions = filteredProducts.filter(p => p.status === 'sold').length;
    
    return {
      timeframe,
      trafficByDate,
      conversionRateByDate,
      categoryDistribution: categoryData,
      userGrowth,
      engagement: {
        totalViews,
        totalClicks,
        totalSaves,
        totalBids
      },
      conversionFunnel: {
        viewToClickRate,
        clickToBidRate,
        overallConversionRate
      },
      marketplace: {
        totalProducts,
        activeListings,
        pendingListings,
        successfulTransactions,
        avgPrice
      },
      userMetrics: {
        totalUsers,
        buildersCount: filteredProfiles.filter(p => p.user_type === 'ai_builder').length,
        investorsCount: filteredProfiles.filter(p => p.user_type === 'ai_investor').length
      }
    };
  };
  
  const aggregateDataByDate = (data: any[], dateField: string, valueField: string) => {
    const byDate: {[key: string]: number} = {};
    
    data.forEach(item => {
      const date = item[dateField];
      const value = item[valueField] || 0;
      
      byDate[date] = (byDate[date] || 0) + value;
    });
    
    return Object.entries(byDate)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  const calcUserGrowth = (profiles: any[], timeframe: string) => {
    // Sort profiles by creation date
    const sortedProfiles = [...profiles].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    // Group by time period based on timeframe
    const usersByPeriod: {[key: string]: number} = {};
    
    sortedProfiles.forEach(profile => {
      const date = new Date(profile.created_at);
      let periodKey = '';
      
      switch(timeframe) {
        case 'week':
          // Group by day
          periodKey = date.toISOString().split('T')[0];
          break;
        case 'month':
          // Group by day
          periodKey = date.toISOString().split('T')[0];
          break;
        case 'quarter':
          // Group by week
          const weekNumber = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7);
          periodKey = `${date.getFullYear()}-${date.getMonth() + 1}-W${weekNumber}`;
          break;
        case 'year':
          // Group by month
          periodKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          break;
      }
      
      usersByPeriod[periodKey] = (usersByPeriod[periodKey] || 0) + 1;
    });
    
    // Convert to array for chart
    return Object.entries(usersByPeriod)
      .map(([period, count]) => ({ period, count }))
      .sort((a, b) => a.period.localeCompare(b.period));
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  const formatPeriod = (period: string) => {
    // Handle different period formats based on timeframe
    if (period.includes('W')) {
      // Week format: YYYY-MM-WN
      const [yearMonth, weekPart] = period.split('-W');
      return `Week ${weekPart}`;
    } else if (period.includes('-')) {
      // Check if it's a full date (YYYY-MM-DD) or year-month (YYYY-MM)
      const parts = period.split('-');
      if (parts.length === 3) {
        // Full date
        return formatDate(period);
      } else if (parts.length === 2) {
        // Year-month
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames[parseInt(parts[1], 10) - 1];
      }
    }
    return period;
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl exo-2-heading">Site Performance Analytics</CardTitle>
          <TabsList>
            <TabsTrigger 
              value="week" 
              onClick={() => setTimeframe('week')}
              className={timeframe === 'week' ? 'bg-primary text-primary-foreground' : ''}
            >
              Last Week
            </TabsTrigger>
            <TabsTrigger 
              value="month" 
              onClick={() => setTimeframe('month')}
              className={timeframe === 'month' ? 'bg-primary text-primary-foreground' : ''}
            >
              Last Month
            </TabsTrigger>
            <TabsTrigger 
              value="quarter" 
              onClick={() => setTimeframe('quarter')}
              className={timeframe === 'quarter' ? 'bg-primary text-primary-foreground' : ''}
            >
              Last Quarter
            </TabsTrigger>
            <TabsTrigger 
              value="year" 
              onClick={() => setTimeframe('year')}
              className={timeframe === 'year' ? 'bg-primary text-primary-foreground' : ''}
            >
              Last Year
            </TabsTrigger>
          </TabsList>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-md" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-[100px] rounded-md" />
              <Skeleton className="h-[100px] rounded-md" />
              <Skeleton className="h-[100px] rounded-md" />
            </div>
          </div>
        ) : analyticsData ? (
          <div className="space-y-6">
            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Traffic</p>
                      <div className="text-2xl font-bold">{analyticsData.engagement.totalViews.toLocaleString()}</div>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <div className="text-2xl font-bold">{analyticsData.conversionFunnel.overallConversionRate.toFixed(1)}%</div>
                    </div>
                    <ArrowUpRight className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <div className="text-2xl font-bold">{analyticsData.userMetrics.totalUsers.toLocaleString()}</div>
                    </div>
                    <Users className="h-8 w-8 text-indigo-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Listings</p>
                      <div className="text-2xl font-bold">{analyticsData.marketplace.activeListings.toLocaleString()}</div>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-pink-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Traffic Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Traffic Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.trafficByDate}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [value.toLocaleString(), "Page Views"]} 
                      labelFormatter={(label) => formatDate(label)}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Page Views" 
                      stroke="#D946EE" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Conversion Funnel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversion Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-indigo-600">
                            Views to Clicks: {analyticsData.conversionFunnel.viewToClickRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                        <div style={{ width: `${Math.min(analyticsData.conversionFunnel.viewToClickRate, 100)}%` }} 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500">
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-purple-600">
                            Clicks to Bids: {analyticsData.conversionFunnel.clickToBidRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                        <div style={{ width: `${Math.min(analyticsData.conversionFunnel.clickToBidRate, 100)}%` }} 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500">
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-pink-600">
                            Overall Conversion: {analyticsData.conversionFunnel.overallConversionRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
                        <div style={{ width: `${Math.min(analyticsData.conversionFunnel.overallConversionRate, 100)}%` }} 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500">
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={analyticsData.categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.categoryDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* User Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="period" tickFormatter={formatPeriod} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [value, "New Users"]}
                      labelFormatter={(label) => formatPeriod(label)}
                    />
                    <Legend />
                    <Bar dataKey="count" name="New Users" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Marketplace Health */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-lg font-medium text-muted-foreground">User Distribution</div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">
                          {analyticsData.userMetrics.buildersCount}
                        </div>
                        <div className="text-sm text-muted-foreground">Builders</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-pink-600">
                          {analyticsData.userMetrics.investorsCount}
                        </div>
                        <div className="text-sm text-muted-foreground">Investors</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-lg font-medium text-muted-foreground">Listing Stats</div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {analyticsData.marketplace.activeListings}
                        </div>
                        <div className="text-sm text-muted-foreground">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600">
                          {analyticsData.marketplace.pendingListings}
                        </div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-lg font-medium text-muted-foreground">Transaction Stats</div>
                    <div className="mt-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {analyticsData.marketplace.successfulTransactions}
                      </div>
                      <div className="text-sm text-muted-foreground">Completed Sales</div>
                    </div>
                    <div className="mt-2 text-sm font-medium">
                      Avg. Price: ${analyticsData.marketplace.avgPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No analytics data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
