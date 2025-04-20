
import { Target } from "lucide-react";

interface MarketPositionProps {
  competitors?: string;
}

export function MarketPosition({ competitors }: MarketPositionProps) {
  if (!competitors) return null;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Target className="h-4 w-4" />
        <span>Market Position</span>
      </div>
      <div className="space-y-3">
        <div>
          <span className="text-gray-600 block mb-1">Competition</span>
          <p className="text-sm bg-gray-50 p-2 rounded-md">{competitors}</p>
        </div>
      </div>
    </div>
  );
}
