import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Database } from "@/integrations/supabase/types";
import { Timer } from "lucide-react";

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardContentProps {
  title: Product['title'];
  description: Product['description'];
  price: Product['price'];
  category: Product['category'];
  stage: Product['stage'];
  monthlyRevenue: Product['monthly_revenue'];
  isAuction?: boolean;
  currentPrice?: number;
  minPrice?: number;
  priceDecrement?: number;
  auctionEndTime?: string;
}

export function ProductCardContent({
  title,
  description,
  price,
  category,
  stage,
  monthlyRevenue,
  isAuction,
  currentPrice,
  minPrice,
  priceDecrement,
  auctionEndTime,
}: ProductCardContentProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      'Content Generation': { bg: 'bg-purple-100', text: 'text-purple-700' },
      'Customer Service': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Image Generation': { bg: 'bg-pink-100', text: 'text-pink-700' },
      'Development Tools': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
      'Audio Processing': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
      'Video Processing': { bg: 'bg-rose-100', text: 'text-rose-700' },
      'Finance': { bg: 'bg-emerald-100', text: 'text-emerald-700' }
    };
    return colors[category] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      'Revenue': { bg: 'bg-green-100', text: 'text-green-700' },
      'MVP': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Prototype': { bg: 'bg-amber-100', text: 'text-amber-700' },
      'Idea': { bg: 'bg-gray-100', text: 'text-gray-700' }
    };
    return colors[stage] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  const auctionEnded = auctionEndTime && new Date(auctionEndTime) < new Date();

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
          {isAuction ? (
            <>
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Price</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(Number(currentPrice))}
                </p>
                <p className="text-sm text-gray-500">
                  Min: {formatCurrency(Number(minPrice))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Price Drop</p>
                <p className="text-lg font-semibold text-amber-600">
                  -{formatCurrency(Number(priceDecrement))}/min
                </p>
                {auctionEndTime && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Timer className="h-4 w-4" />
                    <span>{auctionEnded ? "Ended" : "Active"}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500 mb-1">Price</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(Number(price))}
                </p>
              </div>
              {monthlyRevenue && stage === "Revenue" && (
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Monthly Revenue</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(Number(monthlyRevenue))}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge 
            variant="secondary" 
            className={`${getCategoryColor(category).bg} ${getCategoryColor(category).text}`}
          >
            {category}
          </Badge>
          <Badge 
            variant="secondary" 
            className={`${getStageColor(stage).bg} ${getStageColor(stage).text}`}
          >
            {stage}
          </Badge>
          {isAuction && (
            <Badge 
              variant="secondary" 
              className="bg-amber-100 text-amber-700"
            >
              Dutch Auction
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}