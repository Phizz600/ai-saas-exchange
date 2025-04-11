
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export const UserBehaviorAnalytics = () => {
  const [behaviorData, setBehaviorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
            created_at
          `);

        if (feedbackError) throw feedbackError;

        // Process user behavior data
        const stats = processUserBehaviorData(productAnalytics || [], feedback || []);
        setBehaviorData(stats);
      } catch (error) {
        console.error('Error fetching user behavior data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBehaviorData();
  }, []);

  const processUserBehaviorData = (analytics: any[], feedback: any[]) => {
    // Aggregate analytics by date for trend analysis
    const dates = new Set<string>();
    analytics.forEach(a => dates.add(a.date));

    const sortedDates = Array.from(dates).sort();
    const trendData = sortedDates.map(date => {
      const dayData = analytics.filter(a => a.date === date);
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

    // Process feedback data
    const avgRating = feedback.length > 0
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
      : 0;
    
    const sellerRatings = feedback.filter(f => f.user_role === 'seller');
    const buyerRatings = feedback.filter(f => f.user_role === 'buyer');
    
    const avgSellerRating = sellerRatings.length > 0
      ? sellerRatings.reduce((sum, f) => sum + f.rating, 0) / sellerRatings.length
      : 0;
    
    const avgBuyerRating = buyerRatings.length > 0
      ? buyerRatings.reduce((sum, f) => sum + f.rating, 0) / buyerRatings.length
      : 0;

    return {
      trendData: trendData.slice(-14), // Last 14 days
      conversionRates: {
        clickThroughRate: totalViews > 0 ? (totalClicks / totalViews) * 100 : 0,
        saveRate: totalViews > 0 ? (totalSaves / totalViews) * 100 : 0,
        bidRate: totalViews > 0 ? (totalBids / totalViews) * 100 : 0,
      },
      feedback: {
        totalFeedback: feedback.length,
        averageRating: avgRating,
        averageSellerRating: avgSellerRating,
        averageBuyerRating: avgBuyerRating,
        ratingDistribution: [1, 2, 3, 4, 5].map(rating => ({
          rating,
          count: feedback.filter(f => f.rating === rating).length
        }))
      }
    };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">User Behavior Analysis</CardTitle>
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
                    <div className="text-2xl font-bold">{behaviorData.conversionRates.clickThroughRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Click-Through Rate</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{behaviorData.conversionRates.saveRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Save Rate</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{behaviorData.conversionRates.bidRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Bid Rate</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Engagement Trends (Last 14 Days)</CardTitle>
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
                  <CardTitle className="text-lg">Improvement Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {behaviorData.conversionRates.clickThroughRate < 10 && (
                      <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                        <div className="font-medium">Low Click-Through Rate</div>
                        <div className="text-sm text-muted-foreground">
                          Consider improving product listings visibility and appeal to increase user engagement.
                        </div>
                      </div>
                    )}
                    
                    {behaviorData.conversionRates.bidRate < 5 && (
                      <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                        <div className="font-medium">Low Bid Conversion</div>
                        <div className="text-sm text-muted-foreground">
                          Users are viewing products but not bidding. Consider reviewing pricing strategy or providing more product details.
                        </div>
                      </div>
                    )}
                    
                    {behaviorData.feedback.averageRating < 4 && (
                      <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                        <div className="font-medium">Feedback Scores Below Target</div>
                        <div className="text-sm text-muted-foreground">
                          Transaction experience needs improvement. Review common complaints in user feedback.
                        </div>
                      </div>
                    )}
                    
                    {behaviorData.trendData.length > 0 && 
                     behaviorData.trendData[behaviorData.trendData.length - 1].views < 
                     behaviorData.trendData[0].views && (
                      <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                        <div className="font-medium">Declining Traffic</div>
                        <div className="text-sm text-muted-foreground">
                          Site traffic appears to be decreasing. Consider running promotions or marketing campaigns.
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
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
