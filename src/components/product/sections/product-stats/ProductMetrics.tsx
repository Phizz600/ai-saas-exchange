
import { Target } from "lucide-react";

interface ProductMetricsProps {
  monthlyTraffic: string;
  activeUsers: string;
}

export function ProductMetrics({ monthlyTraffic, activeUsers }: ProductMetricsProps) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Target className="h-4 w-4" />
        <span>Traffic & User Metrics</span>
      </div>
      <div className="space-y-3">
        {monthlyTraffic && (
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <span className="text-gray-600">Monthly Traffic</span>
            <span className="font-medium">{monthlyTraffic}</span>
          </div>
        )}
        {activeUsers && (
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <span className="text-gray-600">Active Users</span>
            <span className="font-medium">{activeUsers}</span>
          </div>
        )}
      </div>
    </div>
  );
}
