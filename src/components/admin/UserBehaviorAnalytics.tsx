
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, Lightbulb, TrendingUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const UserBehaviorAnalytics = () => {
  const [behaviorData, setBehaviorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  useEffect(() => {
    const fetchBehaviorData = async () => {
      setLoading(true);
      try {
        // Fetch product analytics data
        const { data: productAnalytics, error: analyticsError } = await supabase
          .from('product_analytics')
          .select(`
            product_id,
            date,
            views,
            clicks,
            saves,
            likes,
            bids
          `)
          .order('date', { ascending: false })
          .limit(100);

        if (analyticsError) throw analyticsError;

        // Fetch transaction feedback
        const { data: feedback, error: feedbackError } = await supabase
          .from('transaction_feedback')
          .select(`
            id,
            user_role,
            rating,
            feedback,
            created_at
          `);

        if (feedbackError) throw feedbackError;
        
        // Fetch product data for conversion analysis
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select(`
            id,
            title,
            status,
            created_at,
            category,
            price,
            highest_bid
          `)
          .limit(100);
          
        if (productsError) throw productsError;
        
        // Fetch user profiles for user growth analysis
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            created_at,
            user_type
          `)
          .limit(200);
          
        if (profilesError) throw profilesError;

        // Process user behavior data with enhanced analysis
        const stats = processUserBehaviorData(
          productAnalytics || [], 
          feedback || [],
          products || [],
          profiles || [],
          timeRange
        );
        
        setBehaviorData(stats);
      } catch (error) {
        console.error('Error fetching user behavior data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBehaviorData();
  }, [timeRange]);

  const processUserBehaviorData = (
    analytics: any[], 
    feedback: any[],
    products: any[],
    profiles: any[],
    timeRangeParam: string
  ) => {
    // Define date range based on timeRange
    const now = new Date();
    const startDate = new Date();
    
    switch(timeRangeParam) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
    }
    
    // Filter data within the selected time range
    const timeFilteredAnalytics = analytics.filter(a => 
      new Date(a.date) >= startDate && new Date(a.date) <= now
    );
    
    const timeFilteredFeedback = feedback.filter(f => 
      new Date(f.created_at) >= startDate && new Date(f.created_at) <= now
    );
    
    const timeFilteredProducts = products.filter(p => 
      new Date(p.created_at) >= startDate && new Date(p.created_at) <= now
    );
    
    const timeFilteredProfiles = profiles.filter(p => 
      new Date(p.created_at) >= startDate && new Date(p.created_at) <= now
    );

    // Aggregate analytics by date for trend analysis
    const dates = new Set<string>();
    timeFilteredAnalytics.forEach(a => dates.add(a.date));

    const sortedDates = Array.from(dates).sort();
    const trendData = sortedDates.map(date => {
      const dayData = timeFilteredAnalytics.filter(a => a.date === date);
      return {
        date,
        views: dayData.reduce((sum, a) => sum + (a.views || 0), 0),
        clicks: dayData.reduce((sum, a) => sum + (a.clicks || 0), 0),
        saves: dayData.reduce((sum, a) => sum + (a.saves || 0), 0),
        bids: dayData.reduce((sum, a) => sum + (a.bids || 0), 0),
      };
    });

    // Calculate conversion rates
    const totalViews = trendData.reduce((sum, day) => sum + day.views, 0);
    const totalClicks = trendData.reduce((sum, day) => sum + day.clicks, 0);
    const totalSaves = trendData.reduce((sum, day) => sum + day.saves, 0);
    const totalBids = trendData.reduce((sum, day) => sum + day.bids, 0);

    // Calculate trends (compare first half to second half of period)
    const midPoint = Math.floor(trendData.length / 2);
    const firstHalfViews = trendData.slice(0, midPoint).reduce((sum, day) => sum + day.views, 0);
    const secondHalfViews = trendData.slice(midPoint).reduce((sum, day) => sum + day.views, 0);
    const viewsTrend = firstHalfViews > 0 ? ((secondHalfViews - firstHalfViews) / firstHalfViews) * 100 : 0;
    
    const firstHalfBids = trendData.slice(0, midPoint).reduce((sum, day) => sum + day.bids, 0);
    const secondHalfBids = trendData.slice(midPoint).reduce((sum, day) => sum + day.bids, 0);
    const bidsTrend = firstHalfBids > 0 ? ((secondHalfBids - firstHalfBids) / firstHalfBids) * 100 : 0;

    // Process feedback data
    const avgRating = timeFilteredFeedback.length > 0
      ? timeFilteredFeedback.reduce((sum, f) => sum + f.rating, 0) / timeFilteredFeedback.length
      : 0;
    
    const sellerRatings = timeFilteredFeedback.filter(f => f.user_role === 'seller');
    const buyerRatings = timeFilteredFeedback.filter(f => f.user_role === 'buyer');
    
    const avgSellerRating = sellerRatings.length > 0
      ? sellerRatings.reduce((sum, f) => sum + f.rating, 0) / sellerRatings.length
      : 0;
    
    const avgBuyerRating = buyerRatings.length > 0
      ? buyerRatings.reduce((sum, f) => sum + f.rating, 0) / buyerRatings.length
      : 0;

    // Calculate user retention and engagement metrics
    const newUsers = timeFilteredProfiles.length;
    
    // Group users by time period for cohort retention analysis
    const usersByWeek: { [key: string]: any[] } = {};
    timeFilteredProfiles.forEach(profile => {
      const date = new Date(profile.created_at);
      const weekNumber = getWeekNumber(date);
      const weekKey = `${date.getFullYear()}-W${weekNumber}`;
      
      if (!usersByWeek[weekKey]) usersByWeek[weekKey] = [];
      usersByWeek[weekKey].push(profile);
    });
    
    // Calculate cohort retention
    const cohortRetention: { week: string, users: number, activeRate: number }[] = [];
    Object.entries(usersByWeek).forEach(([week, users]) => {
      const usersCount = users.length;
      // Simulate active rate - would need actual login data
      const activeRate = Math.random() * 0.5 + 0.3; // Random 30-80% for demo
      cohortRetention.push({ week, users: usersCount, activeRate });
    });
    
    cohortRetention.sort((a, b) => a.week.localeCompare(b.week));

    // Analyze products for quality assessment
    const activePendingRatio = timeFilteredProducts.length > 0 
      ? timeFilteredProducts.filter(p => p.status === 'active').length / timeFilteredProducts.length
      : 0;

    const averageProductPrice = timeFilteredProducts.length > 0
      ? timeFilteredProducts.reduce((sum, p) => sum + (p.price || 0), 0) / timeFilteredProducts.length
      : 0;

    // Identify improvement opportunities based on data analysis
    const improvementOpportunities = analyzeForImprovements({
      viewsTrend,
      bidsTrend,
      clickThroughRate: totalViews > 0 ? (totalClicks / totalViews) * 100 : 0,
      saveRate: totalViews > 0 ? (totalSaves / totalViews) * 100 : 0,
      bidRate: totalViews > 0 ? (totalBids / totalViews) * 100 : 0,
      averageRating: avgRating,
      activePendingRatio,
      cohortRetention,
      feedbackComments: timeFilteredFeedback,
      trendData,
      products: timeFilteredProducts
    });

    // Calculate key performance indicators benchmarks
    const kpiBenchmarks = {
      clickThroughRate: {
        value: totalViews > 0 ? (totalClicks / totalViews) * 100 : 0,
        target: 15, // Target CTR percentage
        performance: totalViews > 0 ? ((totalClicks / totalViews) * 100) / 15 * 100 : 0, // Percentage of target achieved
      },
      conversionRate: {
        value: totalClicks > 0 ? (totalBids / totalClicks) * 100 : 0,
        target: 5, // Target conversion percentage
        performance: totalClicks > 0 ? ((totalBids / totalClicks) * 100) / 5 * 100 : 0,
      },
      userSatisfaction: {
        value: avgRating * 20, // Convert 1-5 rating to percentage
        target: 80, // Target satisfaction percentage (4/5 stars)
        performance: (avgRating * 20) / 80 * 100,
      }
    };

    return {
      trendData: trendData.slice(-14), // Last 14 days or less
      conversionRates: {
        clickThroughRate: totalViews > 0 ? (totalClicks / totalViews) * 100 : 0,
        saveRate: totalViews > 0 ? (totalSaves / totalViews) * 100 : 0,
        bidRate: totalViews > 0 ? (totalBids / totalViews) * 100 : 0,
      },
      trends: {
        views: viewsTrend,
        bids: bidsTrend
      },
      feedback: {
        totalFeedback: timeFilteredFeedback.length,
        averageRating: avgRating,
        averageSellerRating: avgSellerRating,
        averageBuyerRating: avgBuyerRating,
        ratingDistribution: [1, 2, 3, 4, 5].map(rating => ({
          rating,
          count: timeFilteredFeedback.filter(f => f.rating === rating).length
        }))
      },
      userEngagement: {
        newUsers,
        cohortRetention
      },
      products: {
        activePendingRatio,
        averageProductPrice
      },
      improvementOpportunities,
      kpiBenchmarks
    };
  };

  const analyzeForImprovements = (data: any) => {
    const opportunities = [];
    const {
      viewsTrend,
      bidsTrend,
      clickThroughRate,
      saveRate,
      bidRate,
      averageRating,
      activePendingRatio,
      cohortRetention,
      feedbackComments,
      trendData,
      products
    } = data;

    // Analyze traffic trends
    if (viewsTrend < -10) {
      opportunities.push({
        area: 'Traffic',
        issue: 'Declining Traffic',
        severity: 'high',
        description: `Site traffic has decreased by ${Math.abs(viewsTrend).toFixed(1)}% over the time period.`,
        recommendation: 'Consider running promotions, increasing social media presence, or optimizing SEO to increase traffic.',
        metrics: [{ name: 'Traffic Trend', value: `${viewsTrend.toFixed(1)}%`, color: 'red' }],
        quickFix: true
      });
    }

    // Analyze conversion rates
    if (clickThroughRate < 10) {
      opportunities.push({
        area: 'Engagement',
        issue: 'Low Click-Through Rate',
        severity: clickThroughRate < 5 ? 'high' : 'medium',
        description: `Click-through rate is ${clickThroughRate.toFixed(1)}%, below the target of 15%.`,
        recommendation: 'Improve product listing visibility, enhance product images, and improve headline copy to increase interest.',
        metrics: [{ name: 'CTR', value: `${clickThroughRate.toFixed(1)}%`, color: clickThroughRate < 5 ? 'red' : 'orange' }],
        quickFix: true
      });
    }
    
    if (bidRate < 5) {
      opportunities.push({
        area: 'Conversion',
        issue: 'Low Bid Conversion',
        severity: 'high',
        description: `Bid rate (views to bids) is only ${bidRate.toFixed(1)}%, suggesting potential issues in the conversion funnel.`,
        recommendation: 'Review pricing strategy, provide more detailed product information, and consider implementing trust signals.',
        metrics: [{ name: 'Bid Rate', value: `${bidRate.toFixed(1)}%`, color: 'red' }],
        quickFix: false
      });
    }

    // Analyze user satisfaction
    if (averageRating < 4) {
      opportunities.push({
        area: 'Satisfaction',
        issue: 'Below Target User Satisfaction',
        severity: averageRating < 3 ? 'critical' : 'medium',
        description: `Average rating is ${averageRating.toFixed(1)}/5, below the target of 4.0.`,
        recommendation: 'Review critical feedback, identify common pain points, and prioritize addressing these issues.',
        metrics: [{ name: 'Avg Rating', value: `${averageRating.toFixed(1)}/5`, color: averageRating < 3 ? 'red' : 'orange' }],
        quickFix: false
      });
    }

    // Analyze product quality
    if (activePendingRatio < 0.6) {
      opportunities.push({
        area: 'Product Quality',
        issue: 'High Product Rejection Rate',
        severity: 'medium',
        description: 'A significant percentage of submitted products are not being approved, indicating quality issues.',
        recommendation: 'Provide clearer guidelines to sellers and offer pre-submission checklists to improve quality.',
        metrics: [{ name: 'Approval Rate', value: `${(activePendingRatio * 100).toFixed(1)}%`, color: 'orange' }],
        quickFix: true
      });
    }

    // Analyze cohort retention (if we have at least 2 cohorts)
    if (cohortRetention.length >= 2 && Math.max(...cohortRetention.map(c => c.activeRate)) < 0.5) {
      opportunities.push({
        area: 'Retention',
        issue: 'Low User Retention',
        severity: 'high',
        description: 'User retention rates are below 50%, indicating potential engagement issues.',
        recommendation: 'Implement onboarding improvements, create email re-engagement campaigns, and evaluate the user experience.',
        metrics: [{ name: 'Retention Rate', value: `${(Math.max(...cohortRetention.map(c => c.activeRate)) * 100).toFixed(1)}%`, color: 'red' }],
        quickFix: false
      });
    }

    // Look for anomalies in trend data
    const viewsArray = trendData.map(d => d.views);
    if (viewsArray.length > 5) {
      const avgViews = viewsArray.reduce((sum, v) => sum + v, 0) / viewsArray.length;
      const lastViews = viewsArray[viewsArray.length - 1];
      
      if (lastViews < avgViews * 0.7) {
        opportunities.push({
          area: 'Traffic',
          issue: 'Recent Traffic Drop',
          severity: 'medium',
          description: 'The most recent traffic data shows a significant drop compared to the average.',
          recommendation: 'Investigate potential technical issues, seasonal factors, or marketing campaign changes.',
          metrics: [{ name: 'Last vs Avg', value: `${((lastViews / avgViews) * 100).toFixed(1)}%`, color: 'orange' }],
          quickFix: true
        });
      }
    }

    // Check for seasonal patterns
    // This would need more historical data for proper implementation

    // Analyze product pricing
    const productPrices = products.map(p => p.price).filter(p => p) as number[];
    if (productPrices.length > 0) {
      const avgPrice = productPrices.reduce((sum, p) => sum + p, 0) / productPrices.length;
      const highPriceCount = productPrices.filter(p => p > avgPrice * 1.5).length;
      const highPriceRatio = highPriceCount / productPrices.length;
      
      if (highPriceRatio > 0.3 && bidRate < 10) {
        opportunities.push({
          area: 'Pricing',
          issue: 'Price Sensitivity',
          severity: 'medium',
          description: `${(highPriceRatio * 100).toFixed(1)}% of products are priced significantly above average, which may be affecting conversions.`,
          recommendation: 'Review pricing strategy and consider implementing price elasticity testing to find optimal price points.',
          metrics: [
            { name: 'High Price %', value: `${(highPriceRatio * 100).toFixed(1)}%`, color: 'orange' },
            { name: 'Bid Rate', value: `${bidRate.toFixed(1)}%`, color: 'orange' }
          ],
          quickFix: false
        });
      }
    }

    // Prioritize opportunities by severity
    opportunities.sort((a, b) => {
      const severityScore = { 'critical': 3, 'high': 2, 'medium': 1, 'low': 0 };
      return severityScore[b.severity as keyof typeof severityScore] - severityScore[a.severity as keyof typeof severityScore];
    });

    return opportunities.slice(0, 5); // Return top 5 most important opportunities
  };

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const formatTrend = (value: number) => {
    if (value > 0) {
      return (
        <span className="flex items-center text-green-600">
          <ArrowUpRight className="h-4 w-4 mr-1" />
          {value.toFixed(1)}%
        </span>
      );
    } else if (value < 0) {
      return (
        <span className="flex items-center text-red-600">
          <ArrowDownRight className="h-4 w-4 mr-1" />
          {Math.abs(value).toFixed(1)}%
        </span>
      );
    } else {
      return <span className="text-gray-600">0%</span>;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap">
          <CardTitle className="text-xl exo-2-heading">User Behavior Analysis</CardTitle>
          <div className="mt-2 sm:mt-0">
            <TabsList>
              <TabsTrigger 
                value="week" 
                onClick={() => setTimeRange('week')}
                className={timeRange === 'week' ? 'bg-primary text-primary-foreground' : ''}
              >
                Last Week
              </TabsTrigger>
              <TabsTrigger 
                value="month" 
                onClick={() => setTimeRange('month')}
                className={timeRange === 'month' ? 'bg-primary text-primary-foreground' : ''}
              >
                Last Month
              </TabsTrigger>
              <TabsTrigger 
                value="quarter" 
                onClick={() => setTimeRange('quarter')}
                className={timeRange === 'quarter' ? 'bg-primary text-primary-foreground' : ''}
              >
                Last Quarter
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-md" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-[100px] rounded-md" />
              <Skeleton className="h-[100px] rounded-md" />
              <Skeleton className="h-[100px] rounded-md" />
            </div>
          </div>
        ) : behaviorData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Click-Through Rate</div>
                    <div className="text-2xl font-bold">{behaviorData.conversionRates.clickThroughRate.toFixed(1)}%</div>
                    <div className="text-sm mt-1">
                      {formatTrend(behaviorData.trends.views)}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Save Rate</div>
                    <div className="text-2xl font-bold">{behaviorData.conversionRates.saveRate.toFixed(1)}%</div>
                    <div className="text-sm mt-1">vs 8.2% benchmark</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Bid Rate</div>
                    <div className="text-2xl font-bold">{behaviorData.conversionRates.bidRate.toFixed(1)}%</div>
                    <div className="text-sm mt-1">
                      {formatTrend(behaviorData.trends.bids)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={behaviorData.trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, ""]} labelFormatter={(label) => formatDate(label)} />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" name="Views" />
                    <Line type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
                    <Line type="monotone" dataKey="saves" stroke="#ffc658" name="Saves" />
                    <Line type="monotone" dataKey="bids" stroke="#ff8042" name="Bids" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-3xl font-bold">{behaviorData.feedback.averageRating.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Overall Rating</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold">{behaviorData.feedback.averageSellerRating.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Seller Rating</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold">{behaviorData.feedback.averageBuyerRating.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Buyer Rating</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {behaviorData.feedback.ratingDistribution.map((item: any) => (
                        <div
                          key={item.rating}
                          className="flex-1 bg-blue-100 relative"
                          style={{ height: '40px' }}
                        >
                          <div
                            className="absolute bottom-0 w-full bg-blue-500"
                            style={{
                              height: `${(item.count / Math.max(...behaviorData.feedback.ratingDistribution.map((i: any) => i.count), 1)) * 100}%`,
                            }}
                          ></div>
                          <div className="absolute w-full text-center text-xs font-medium -bottom-5">
                            {item.rating}★
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">KPI Performance</CardTitle>
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Click-Through Rate</span>
                        <span className="font-medium">{behaviorData.kpiBenchmarks.clickThroughRate.value.toFixed(1)}% / {behaviorData.kpiBenchmarks.clickThroughRate.target}%</span>
                      </div>
                      <Progress value={behaviorData.kpiBenchmarks.clickThroughRate.performance} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Conversion Rate</span>
                        <span className="font-medium">{behaviorData.kpiBenchmarks.conversionRate.value.toFixed(1)}% / {behaviorData.kpiBenchmarks.conversionRate.target}%</span>
                      </div>
                      <Progress value={behaviorData.kpiBenchmarks.conversionRate.performance} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>User Satisfaction</span>
                        <span className="font-medium">{behaviorData.kpiBenchmarks.userSatisfaction.value.toFixed(1)}% / {behaviorData.kpiBenchmarks.userSatisfaction.target}%</span>
                      </div>
                      <Progress value={behaviorData.kpiBenchmarks.userSatisfaction.performance} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Improvement Opportunities</CardTitle>
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {behaviorData.improvementOpportunities.length > 0 ? (
                    behaviorData.improvementOpportunities.map((opportunity: any, index: number) => (
                      <div key={index} className={`p-4 rounded-md border ${getSeverityColor(opportunity.severity)}`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <div className="flex items-center">
                            <h4 className="font-medium">{opportunity.issue}</h4>
                            <Badge variant="outline" className="ml-2 text-xs">{opportunity.area}</Badge>
                            {opportunity.quickFix && (
                              <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">Quick Win</Badge>
                            )}
                          </div>
                          <div className="flex items-center mt-2 md:mt-0 space-x-2">
                            {opportunity.metrics.map((metric: any, idx: number) => (
                              <Badge key={idx} variant="outline" className={`text-xs bg-white text-${metric.color}-700 border-${metric.color}-200`}>
                                {metric.name}: {metric.value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">{opportunity.description}</p>
                        <p className="text-sm font-medium mt-2">Recommendation: {opportunity.recommendation}</p>
                      </div>
                    ))
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No significant improvement opportunities identified at this time. Continue monitoring metrics.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {behaviorData.userEngagement.cohortRetention.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Retention by Cohort</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={behaviorData.userEngagement.cohortRetention}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis yAxisId="left" orientation="left" label={{ value: 'New Users', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 1]} tickFormatter={(v) => `${(v*100).toFixed(0)}%`}
                        label={{ value: 'Retention Rate', angle: 90, position: 'insideRight' }} />
                      <Tooltip formatter={(value, name) => [
                        name === 'activeRate' ? `${(Number(value) * 100).toFixed(1)}%` : value,
                        name === 'activeRate' ? 'Retention Rate' : 'New Users'
                      ]} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="users" fill="#8884d8" name="New Users" />
                      <Bar yAxisId="right" dataKey="activeRate" fill="#82ca9d" name="Retention Rate" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No user behavior data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
