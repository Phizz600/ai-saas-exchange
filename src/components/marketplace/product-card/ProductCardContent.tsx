import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              {title}
            </CardTitle>
            <div className="flex gap-2 items-center mt-1">
              <Badge variant="outline" className="text-xs font-medium">
                {category}
              </Badge>
              <Badge 
                variant="secondary"
                className={cn(
                  "text-xs font-medium",
                  stage === "Revenue" && "bg-green-100 text-green-800",
                  stage === "MVP" && "bg-blue-100 text-blue-800",
                  stage === "Pre-Revenue" && "bg-orange-100 text-orange-800"
                )}
              >
                {stage}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              ${price.toLocaleString()}
            </div>
            {stage === "Revenue" && (
              <div className="text-sm text-green-600 font-medium">
                ${monthlyRevenue.toLocaleString()}/mo
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 line-clamp-2">{description}</p>
      </CardContent>
    </>
  );
}