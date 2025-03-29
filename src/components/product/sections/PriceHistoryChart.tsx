
import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart,
  CartesianGrid,
  ReferenceLine
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { PriceAnalytics } from "./PriceAnalytics";
import { motion } from "framer-motion";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface PriceHistoryChartProps {
  productId: string;
}

export function PriceHistoryChart({ productId }: PriceHistoryChartProps) {
  const [timeRange, setTimeRange] = useState<"1M" | "3M" | "6M" | "1Y">("1M");
  const [chartType, setChartType] = useState<"line" | "area">("area");
  
  const { data: priceHistory, isLoading } = useQuery({
    queryKey: ['price-history', productId, timeRange],
    queryFn: async () => {
      const rangeInDays = timeRange === "1Y" ? 365 : 
                         timeRange === "6M" ? 180 : 
                         timeRange === "3M" ? 90 : 30;

      const { data, error } = await supabase
        .from('price_history')
        .select('price, created_at, type')
        .eq('product_id', productId)
        .gte('created_at', new Date(Date.now() - rangeInDays * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data.map(entry => ({
        date: format(new Date(entry.created_at), 'MMM dd'),
        price: entry.price,
        type: entry.type
      }));
    }
  });

  // Calculate price analytics
  const priceAnalytics = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) {
      return { min: 0, max: 0, avg: 0, change: 0, changePercent: 0 };
    }

    const prices = priceHistory.map(item => item.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    const firstPrice = priceHistory[0].price;
    const lastPrice = priceHistory[priceHistory.length - 1].price;
    const change = lastPrice - firstPrice;
    const changePercent = (change / firstPrice) * 100;
    
    return { min, max, avg, change, changePercent };
  }, [priceHistory]);

  if (isLoading) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="exo-2-heading">Price History</span>
            <div className="animate-pulse bg-gray-200 h-6 w-36 rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  if (!priceHistory || priceHistory.length < 2) {
    return null; // Don't show the chart if there's not enough price history
  }

  const chartConfig = {
    "price": {
      label: "Price",
      theme: {
        light: "#8B5CF6",
        dark: "#D946EE"
      }
    }
  };

  // Find the average price for the reference line
  const avgPrice = priceAnalytics.avg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="p-6 overflow-hidden">
        <CardHeader className="px-0 pt-0">
          <div className="flex justify-between items-center flex-wrap gap-4 mb-2">
            <CardTitle className="exo-2-heading">Price History</CardTitle>
            <div className="flex gap-2">
              {["1M", "3M", "6M", "1Y"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range as "1M" | "3M" | "6M" | "1Y")}
                  className={timeRange === range ? "bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white" : ""}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <Button
                variant={chartType === "area" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("area")}
                className={chartType === "area" ? "bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white" : ""}
              >
                Area
              </Button>
              <Button
                variant={chartType === "line" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("line")}
                className={chartType === "line" ? "bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white" : ""}
              >
                Line
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              {priceHistory.length} data points
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-0 pb-0">
          <div className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-[300px]">
              {chartType === "area" ? (
                <AreaChart data={priceHistory}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#D946EE" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
                  <XAxis 
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickLine={{ stroke: '#8B5CF6' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fontSize: 10 }}
                    tickLine={{ stroke: '#8B5CF6' }}
                    domain={['auto', 'auto']}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={(value) => `$${Number(value).toLocaleString()}`} />}
                  />
                  <ReferenceLine 
                    y={avgPrice} 
                    stroke="#0EA4E9" 
                    strokeDasharray="3 3"
                    label={{ value: `Avg: $${avgPrice.toLocaleString()}`, position: 'right', fill: '#0EA4E9', fontSize: 10 }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#8B5CF6" 
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                    name="price"
                    strokeWidth={2}
                    activeDot={{ r: 6, stroke: '#D946EE', strokeWidth: 2, fill: 'white' }}
                  />
                </AreaChart>
              ) : (
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
                  <XAxis 
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickLine={{ stroke: '#8B5CF6' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fontSize: 10 }}
                    tickLine={{ stroke: '#8B5CF6' }}
                    domain={['auto', 'auto']}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={(value) => `$${Number(value).toLocaleString()}`} />}
                  />
                  <ReferenceLine 
                    y={avgPrice} 
                    stroke="#0EA4E9" 
                    strokeDasharray="3 3" 
                    label={{ value: `Avg: $${avgPrice.toLocaleString()}`, position: 'right', fill: '#0EA4E9', fontSize: 10 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    name="price"
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ stroke: '#D946EE', strokeWidth: 2, fill: 'white', r: 4 }}
                    activeDot={{ r: 6, stroke: '#D946EE', strokeWidth: 2, fill: 'white' }}
                  />
                </LineChart>
              )}
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <PriceAnalytics 
        analytics={priceAnalytics}
        productId={productId}
        timeRange={timeRange}
      />
    </motion.div>
  );
}
