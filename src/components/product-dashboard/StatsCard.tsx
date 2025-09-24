
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
  icon?: React.ReactNode;
}

export const StatsCard = ({ title, value, change, subtitle, icon }: StatsCardProps) => {
  return (
    <Card className="p-4 md:p-6 hover:shadow-md transition-shadow h-full">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground truncate pr-2">{title}</h3>
          {icon && <div className="flex-shrink-0">{icon}</div>}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-xl md:text-2xl font-bold leading-tight">{value}</p>
        </div>
        <div className="mt-3">
          {change ? (
            <div className="flex items-center space-x-1">
              {change.type === 'increase' ? (
                <ArrowUp className="w-3 h-3 text-green-500 flex-shrink-0" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-500 flex-shrink-0" />
              )}
              <span className={`text-xs font-medium ${
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change.value}%
              </span>
              {subtitle && (
                <span className="text-xs text-muted-foreground ml-1 truncate">{subtitle}</span>
              )}
            </div>
          ) : (
            subtitle && (
              <span className="text-xs text-muted-foreground truncate">{subtitle}</span>
            )
          )}
        </div>
      </div>
    </Card>
  );
};
