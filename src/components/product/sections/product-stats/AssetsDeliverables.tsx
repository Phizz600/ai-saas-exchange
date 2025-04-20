
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { hasValue } from "@/utils/productHelpers";

interface AssetsDeliverablesProps {
  deliverables?: string[];
}

export function AssetsDeliverables({ deliverables }: AssetsDeliverablesProps) {
  // If no deliverables or empty array, don't render this component
  if (!hasValue(deliverables) || deliverables.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Package className="h-4 w-4" />
        <span>Assets & Deliverables</span>
      </div>
      
      <div>
        <h3 className="text-base font-medium mb-3 text-gray-700">Included in Purchase</h3>
        <div className="flex flex-wrap gap-2">
          {deliverables.map((item, index) => (
            <Badge key={index} className="bg-green-100 text-green-800 px-3 py-1">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
