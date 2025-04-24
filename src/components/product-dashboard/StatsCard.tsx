
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
    <Card className="p-4 md:p-6">
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-xl md:text-2xl font-bold mt-1">{value}</p>
        {change && (
          <div className="flex items-center mt-2 space-x-1">
            {change.type === 'increase' ? (
              <ArrowUp className="w-3 h-3 text-green-500" />
            ) : (
              <ArrowDown className="w-3 h-3 text-red-500" />
            )}
            <span className={`text-xs font-medium ${
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change.value}%
            </span>
            {subtitle && (
              <span className="text-xs text-gray-500 ml-1">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
