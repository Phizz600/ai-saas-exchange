import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface PriceHistoryChartProps {
  productId: string;
}

export function PriceHistoryChart({ productId }: PriceHistoryChartProps) {
  const [timeRange, setTimeRange] = useState<"1M" | "3M" | "6M" | "1Y">("1M");
  
  // Mock data - replace with real data from your API
  const data = [
    { date: "2024-01", price: 10000 },
    { date: "2024-02", price: 9500 },
    { date: "2024-03", price: 9800 },
    // ... more data points
  ];

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
          <LineChart data={data}>
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