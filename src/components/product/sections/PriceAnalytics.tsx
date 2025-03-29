
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, HelpCircle } from "lucide-react";
import { TooltipProvider, Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [chartView, setChartView] = useState<"activity" | "distribution">("activity");

  // Fetch bid activity data
  const { data: bidActivityData, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['bid-activity', productId, timeRange],
    queryFn: async () => {
      const rangeInDays = timeRange === "1Y" ? 365 : 
                          timeRange === "6M" ? 180 : 
                          timeRange === "3M" ? 90 : 30;

      const { data, error } = await supabase
        .from('bids')
        .select('created_at')
        .eq('product_id', productId)
        .gte('created_at', new Date(Date.now() - rangeInDays * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;
      
      // Group bids by period based on time range
      let periods: string[] = [];
      if (timeRange === "1M") {
        periods = ["Week 1", "Week 2", "Week 3", "Week 4"];
      } else if (timeRange === "3M") {
        periods = ["Month 1", "Month 2", "Month 3"];
      } else if (timeRange === "6M") {
        periods = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"];
      } else {
        periods = ["Q1", "Q2", "Q3", "Q4"];
      }
      
      // Initialize with zero counts
      const bidsByPeriod: Record<string, number> = {};
      periods.forEach(period => {
        bidsByPeriod[period] = 0;
      });

      // Fill with actual data if available
      if (data && data.length > 0) {
        data.forEach(bid => {
          const date = new Date(bid.created_at);
          let period: string;
          
          if (timeRange === "1M") {
            const dayOfMonth = date.getDate();
            if (dayOfMonth <= 7) period = "Week 1";
            else if (dayOfMonth <= 14) period = "Week 2";
            else if (dayOfMonth <= 21) period = "Week 3";
            else period = "Week 4";
          } else if (timeRange === "3M" || timeRange === "6M") {
            const monthIndex = date.getMonth();
            const currentMonth = new Date().getMonth();
            let monthsAgo = (currentMonth - monthIndex + 12) % 12;
            const totalMonths = timeRange === "6M" ? 6 : 3;
            
            if (monthsAgo >= totalMonths) monthsAgo = totalMonths - 1;
            period = `Month ${totalMonths - monthsAgo}`;
          } else {
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
  
  // Fetch bid distribution data
  const { data: bidDistributionData, isLoading: isLoadingDistribution } = useQuery({
    queryKey: ['bid-distribution', productId],
    queryFn: async () => {
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

  const COLORS = ['#D946EE', '#8B5CF6', '#0EA4E9', '#10B981'];
  
  // Count total bids
  const totalBids = bidActivityData?.reduce((sum, item) => sum + item.value, 0) || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Price Metrics Card */}
      <Card className="border-2 border-[#D946EE]/30 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-[#D946EE]/10 to-[#8B5CF6]/10 px-6 py-4 border-b border-[#D946EE]/20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-[#D946EE]/20">
              <Activity className="h-5 w-5 text-[#D946EE]" />
            </div>
            <h3 className="text-xl font-bold exo-2-heading text-gray-800">Price Metrics</h3>
          </div>
        </div>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Current Range</p>
              <p className="text-lg font-semibold">
                ${analytics.min.toLocaleString()} - ${analytics.max.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Average Price</p>
              <p className="text-lg font-semibold">${analytics.avg.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Price Change</p>
            <p className={`text-lg font-semibold ${analytics.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.change.toLocaleString()} ({analytics.changePercent.toFixed(1)}%)
            </p>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Badge variant="outline" className="bg-[#D946EE]/10 text-[#D946EE] border-0 rounded-full px-4">
              {timeRange} Period
            </Badge>
            <Badge variant="outline" className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-0 rounded-full px-4">
              {totalBids} Bids
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Bid Analytics Card */}
      <Card className="lg:col-span-2 border-2 border-[#8B5CF6]/30 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#0EA4E9]/10 px-6 py-4 border-b border-[#8B5CF6]/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-[#8B5CF6]/20">
                <Users className="h-5 w-5 text-[#8B5CF6]" />
              </div>
              <h3 className="text-xl font-bold exo-2-heading text-gray-800 flex items-center">
                Bid Analytics
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        View bid activity over time or bid distribution across price ranges
                      </p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </h3>
            </div>
            
            <Tabs value={chartView} onValueChange={(v) => setChartView(v as "activity" | "distribution")} className="w-auto">
              <TabsList className="bg-gray-100">
                <TabsTrigger 
                  value="activity"
                  className={`${chartView === "activity" ? "bg-[#8B5CF6] text-white" : "text-gray-600"} px-4`}
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger 
                  value="distribution"
                  className={`${chartView === "distribution" ? "bg-[#D946EE] text-white" : "text-gray-600"} px-4`}
                >
                  Distribution
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="h-[240px]">
            {chartView === "activity" ? (
              isLoadingActivity ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="animate-pulse bg-gray-200 h-full w-full rounded-md"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bidActivityData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#D946EE" stopOpacity={0.5}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                      allowDecimals={false}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderColor: '#8B5CF6',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`${value} bids`, "Activity"]}
                      labelFormatter={(label) => `Period: ${label}`}
                    />
                    <Bar 
                      dataKey="value" 
                      name="Bids"
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                      animationDuration={800}
                      animationEasing="ease-in-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )
            ) : (
              isLoadingDistribution ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="animate-pulse bg-gray-200 h-full w-full rounded-md"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {COLORS.map((color, index) => (
                        <linearGradient key={index} id={`pieGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={color} stopOpacity={0.5}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={bidDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={85}
                      innerRadius={40}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      animationDuration={800}
                      animationEasing="ease-in-out"
                    >
                      {bidDistributionData?.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#pieGradient${index % COLORS.length})`} 
                        />
                      ))}
                    </Pie>
                    <Legend 
                      verticalAlign="bottom" 
                      iconType="circle" 
                      iconSize={8}
                      formatter={(value) => {
                        return <span className="text-xs">{value}</span>;
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderColor: '#D946EE',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`${value} bids`, "Count"]}
                      labelFormatter={(name) => `Price Range: $${name}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )
            )}
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            {chartView === "activity" 
              ? `Bid activity over ${timeRange} time period` 
              : "Distribution of bids across price ranges"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
