
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
      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-sm font-semibold text-gray-600">Monthly Revenue</span>
          <div className="font-medium text-green-600">
            {monthlyRevenue ? formatCurrency(Number(monthlyRevenue)) : '-'}
          </div>
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-600">Stage</span>
          <div>
            <Badge 
              variant="secondary" 
              className={`${getStageColor(stage).bg} ${getStageColor(stage).text}`}
            >
              {stage}
            </Badge>
          </div>
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-600">Category</span>
          <div>
            <Badge 
              variant="secondary" 
              className={`${getCategoryColor(category).bg} ${getCategoryColor(category).text}`}
            >
              {category}
            </Badge>
          </div>
        </div>
        {isAuction && (
          <div>
            <Badge 
              variant="secondary" 
              className="bg-amber-100 text-amber-700"
            >
              Dutch Auction
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
