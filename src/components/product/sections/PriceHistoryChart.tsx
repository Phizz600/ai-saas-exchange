
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface PriceHistoryChartProps {
  productId: string;
}

export function PriceHistoryChart({ productId }: PriceHistoryChartProps) {
  const [timeRange, setTimeRange] = useState<"1M" | "3M" | "6M" | "1Y">("1M");
  
  const { data: priceHistory, isLoading } = useQuery({
    queryKey: ['price-history', productId, timeRange],
    queryFn: async () => {
      const rangeInDays = timeRange === "1Y" ? 365 : 
                         timeRange === "6M" ? 180 : 
                         timeRange === "3M" ? 90 : 30;

      const { data, error } = await supabase
        .from('price_history')
        .select('price, created_at')
        .eq('product_id', productId)
        .gte('created_at', new Date(Date.now() - rangeInDays * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data.map(bid => ({
        date: format(new Date(bid.created_at), 'MMM dd'),
        price: bid.price
      }));
    }
  });

  if (isLoading || !priceHistory || priceHistory.length === 0) {
    return null; // Don't show the chart if there's no price history
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Price History</h3>
        <div className="flex gap-2">
          {["1M", "3M", "6M", "1Y"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range as "1M" | "3M" | "6M" | "1Y")}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceHistory}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
