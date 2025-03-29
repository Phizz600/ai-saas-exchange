
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, History, Users, Activity, HelpCircle } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PriceAnalyticsProps {
  analytics: {
    min: number;
    max: number;
    avg: number;
    change: number;
    changePercent: number;
  };
  productId: string;
  timeRange: string;
}

export function PriceAnalytics({ analytics, productId, timeRange }: PriceAnalyticsProps) {
  const [chartView, setChartView] = useState<"bidActivity" | "bidDistribution">("bidActivity");

  // Fetch bid activity data
  const { data: bidActivityData, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['bid-activity', productId, timeRange],
    queryFn: async () => {
      // In a real app, you might fetch this from a specialized endpoint
      // Here we'll simulate some bid activity data based on time periods
      const rangeInDays = timeRange === "1Y" ? 365 : 
                          timeRange === "6M" ? 180 : 
                          timeRange === "3M" ? 90 : 30;

      const { data, error } = await supabase
        .from('bids')
        .select('created_at')
        .eq('product_id', productId)
        .gte('created_at', new Date(Date.now() - rangeInDays * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;
      
      // Group bids by day/week/month depending on time range
      const bidsByPeriod: Record<string, number> = {};
      
      // Create period labels based on time range
      let periods: string[] = [];
      if (timeRange === "1M") {
        // For 1 month, show weeks
        periods = ["Week 1", "Week 2", "Week 3", "Week 4"];
      } else if (timeRange === "3M") {
        // For 3 months, show months
        periods = ["Month 1", "Month 2", "Month 3"];
      } else if (timeRange === "6M") {
        // For 6 months, show months
        periods = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"];
      } else {
        // For 1 year, show quarters
        periods = ["Q1", "Q2", "Q3", "Q4"];
      }
      
      // Initialize with zero counts
      periods.forEach(period => {
        bidsByPeriod[period] = 0;
      });

      // Fill with actual data if available
      if (data && data.length > 0) {
        data.forEach(bid => {
          const date = new Date(bid.created_at);
          let period: string;
          
          if (timeRange === "1M") {
            // Week number within the month
            const dayOfMonth = date.getDate();
            if (dayOfMonth <= 7) period = "Week 1";
            else if (dayOfMonth <= 14) period = "Week 2";
            else if (dayOfMonth <= 21) period = "Week 3";
            else period = "Week 4";
          } else if (timeRange === "3M" || timeRange === "6M") {
            // Month number
            const monthIndex = date.getMonth();
            const currentMonth = new Date().getMonth();
            let monthsAgo = (currentMonth - monthIndex + 12) % 12;
            if (monthsAgo >= 6 && timeRange === "6M") monthsAgo = 5;
            if (monthsAgo >= 3 && timeRange === "3M") monthsAgo = 2;
            period = `Month ${6 - monthsAgo}`;
            if (timeRange === "3M") period = `Month ${3 - monthsAgo}`;
          } else {
            // Quarter
            const month = date.getMonth();
            if (month < 3) period = "Q1";
            else if (month < 6) period = "Q2";
            else if (month < 9) period = "Q3";
            else period = "Q4";
          }
          
          if (bidsByPeriod[period] !== undefined) {
            bidsByPeriod[period]++;
          }
        });
      }

      return Object.entries(bidsByPeriod).map(([name, value]) => ({ name, value }));
    }
  });
  
  // Fetch bid distribution data (simulate for now)
  const { data: bidDistributionData, isLoading: isLoadingDistribution } = useQuery({
    queryKey: ['bid-distribution', productId],
    queryFn: async () => {
      // In a real app, you would fetch the actual bid distribution from your backend
      // Here we'll generate simulated data
      
      // Get actual min and max from analytics
      const min = analytics.min;
      const max = analytics.max;
      const range = max - min;
      
      // Create price brackets
      const brackets = [
        { 
          name: `${min.toLocaleString()} - ${(min + range*0.25).toLocaleString()}`, 
          value: Math.floor(Math.random() * 15) + 5
        },
        { 
          name: `${(min + range*0.25).toLocaleString()} - ${(min + range*0.5).toLocaleString()}`, 
          value: Math.floor(Math.random() * 20) + 10 
        },
        { 
          name: `${(min + range*0.5).toLocaleString()} - ${(min + range*0.75).toLocaleString()}`, 
          value: Math.floor(Math.random() * 15) + 10
        },
        { 
          name: `${(min + range*0.75).toLocaleString()} - ${max.toLocaleString()}`, 
          value: Math.floor(Math.random() * 10) + 5
        }
      ];
      
      return brackets;
    }
  });

  // Set up colors for the pie chart
  const COLORS = ['#D946EE', '#8B5CF6', '#0EA4E9', '#10B981'];
  
  const bidActivityBarColors = {
    "Week 1": "#D946EE",
    "Week 2": "#C837EC",
    "Week 3": "#B729EA",
    "Week 4": "#A61BE8",
    "Month 1": "#D946EE",
    "Month 2": "#C837EC", 
    "Month 3": "#B729EA",
    "Month 4": "#A61BE8",
    "Month 5": "#952AE6",
    "Month 6": "#8B5CF6",
    "Q1": "#D946EE",
    "Q2": "#B729EA",
    "Q3": "#952AE6",
    "Q4": "#8B5CF6"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Price Metrics Card */}
      <Card className="p-6 border-t-4 border-[#D946EE]">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="exo-2-heading flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-[#D946EE]" />
            Price Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Current Range</div>
              <div className="font-semibold mt-1">
                ${analytics.min.toLocaleString()} - ${analytics.max.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Average Price</div>
              <div className="font-semibold mt-1">${analytics.avg.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-500">Price Change</div>
            <div className="flex items-center mt-1">
              <span className={`font-semibold ${analytics.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.change >= 0 ? '+' : ''}{analytics.change.toLocaleString()} ({analytics.changePercent.toFixed(1)}%)
              </span>
              {analytics.change >= 0 ? (
                <TrendingUp className="ml-2 h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="ml-2 h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-[#D946EE]/10 text-[#D946EE] border-0">
              {timeRange} Period
            </Badge>
            <Badge variant="outline" className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-0">
              {bidActivityData?.reduce((sum, item) => sum + item.value, 0) || 0} Bids
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Bid Activity/Distribution Chart Card */}
      <Card className="lg:col-span-2 p-6">
        <CardHeader className="px-0 pt-0">
          <div className="flex justify-between items-center">
            <CardTitle className="exo-2-heading flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-[#8B5CF6]" />
              Bid Analytics
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-xs">
                      View bid activity over time or distribution across price ranges
                    </p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="flex gap-2">
              <Badge 
                variant={chartView === "bidActivity" ? "default" : "outline"}
                className={`cursor-pointer ${chartView === "bidActivity" ? "bg-[#8B5CF6]" : ""}`}
                onClick={() => setChartView("bidActivity")}
              >
                <History className="h-3 w-3 mr-1" />
                Activity
              </Badge>
              <Badge 
                variant={chartView === "bidDistribution" ? "default" : "outline"}
                className={`cursor-pointer ${chartView === "bidDistribution" ? "bg-[#D946EE]" : ""}`}
                onClick={() => setChartView("bidDistribution")}
              >
                <Activity className="h-3 w-3 mr-1" />
                Distribution
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="h-[200px]">
            {chartView === "bidActivity" ? (
              isLoadingActivity ? (
                <div className="h-full w-full bg-gray-100 animate-pulse rounded-md"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bidActivityData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip 
                      formatter={(value) => [`${value} bids`, "Activity"]}
                      labelFormatter={(label) => `Period: ${label}`}
                    />
                    <Bar 
                      dataKey="value" 
                      name="Bids"
                      radius={[4, 4, 0, 0]}
                      fill="#8B5CF6"
                      //getBarFill for custom color per period
                      fillOpacity={0.8}
                    >
                      {bidActivityData?.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={bidActivityBarColors[entry.name as keyof typeof bidActivityBarColors] || "#8B5CF6"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )
            ) : (
              isLoadingDistribution ? (
                <div className="h-full w-full bg-gray-100 animate-pulse rounded-md"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bidDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {bidDistributionData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip 
                      formatter={(value) => [`${value} bids`, "Count"]}
                      labelFormatter={(name) => `Price Range: $${name}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )
            )}
          </div>
          {chartView === "bidActivity" ? (
            <div className="text-xs text-center text-gray-500 mt-2">
              Bid activity over {timeRange} time period
            </div>
          ) : (
            <div className="text-xs text-center text-gray-500 mt-2">
              Distribution of bids across price ranges
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
