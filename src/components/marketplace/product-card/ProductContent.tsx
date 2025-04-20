
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Check } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductContentProps {
  product: Product;
  showLimitedInfo: boolean;
}

export function ProductContent({ product, showLimitedInfo }: ProductContentProps) {
  return (
    <CardContent className="p-6">
      <h3 className="font-exo text-xl font-semibold text-gray-900 mb-2">
        {product.title}
      </h3>
      
      {!showLimitedInfo && (
        <p className="text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          {product.category}
        </Badge>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {product.stage}
        </Badge>
        {product.is_revenue_verified && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="w-3 h-3 mr-1" />
            Verified Revenue
          </Badge>
        )}
      </div>

      {!showLimitedInfo && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Price</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(product.price)}
            </span>
          </div>
          {product.monthly_revenue !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Revenue</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(product.monthly_revenue)}
              </span>
            </div>
          )}
        </div>
      )}
    </CardContent>
  );
}
