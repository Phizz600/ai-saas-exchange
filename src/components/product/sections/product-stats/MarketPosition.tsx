
import { TrendingUp } from "lucide-react";
import { hasValue } from "@/utils/productHelpers";

interface MarketPositionProps {
  competitors?: string;
}

export function MarketPosition({ competitors }: MarketPositionProps) {
  // If no competitors information, don't render this component
  if (!hasValue(competitors)) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <TrendingUp className="h-4 w-4" />
        <span>Market Position</span>
      </div>
      
      <div className="border-l-4 border-l-purple-400 pl-4 py-2">
        <h4 className="text-base font-medium mb-2 text-gray-700">Competitors</h4>
        <p className="text-gray-600 whitespace-pre-wrap">{competitors}</p>
      </div>
    </div>
  );
}
