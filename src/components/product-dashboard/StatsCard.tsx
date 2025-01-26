import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  subtitle?: string;
}

export const StatsCard = ({ title, value, change, subtitle }: StatsCardProps) => {
  return (
    <Card className="p-6 bg-white">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {change && (
            <div className={`flex items-center ${
              change.type === 'increase' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {change.type === 'increase' ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
    </Card>
  );
};