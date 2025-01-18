import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface ProductCardContentProps {
  title: string;
  description: string;
  price: number;
  category: string;
  stage: string;
  monthlyRevenue: number;
}

export function ProductCardContent({
  title,
  description,
  price,
  category,
  stage,
  monthlyRevenue,
}: ProductCardContentProps) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-gray-500 mb-1">Price</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(price)}
            </p>
          </div>
          {stage === "Revenue" && (
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Monthly Revenue</p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(monthlyRevenue)}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-gray-100/80">
            {category}
          </Badge>
          <Badge 
            variant="secondary" 
            className={
              stage === "Revenue" 
                ? "bg-green-100/80 text-green-700" 
                : stage === "MVP" 
                ? "bg-blue-100/80 text-blue-700"
                : "bg-gray-100/80"
            }
          >
            {stage}
          </Badge>
        </div>
      </div>
    </div>
  );
}