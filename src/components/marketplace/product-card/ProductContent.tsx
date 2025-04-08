
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Database } from "@/integrations/supabase/types";
import { Timer, TrendingDown } from "lucide-react";

type Product = Database['public']['Tables']['products']['Row'];

interface ProductContentProps {
  title: Product['title'];
  description: Product['description'];
  price: Product['price'];
  category: Product['category'];
  stage: Product['stage'];
  monthlyRevenue: Product['monthly_revenue'];
  auction_end_time?: Product['auction_end_time'];
  current_price?: Product['current_price'];
  min_price?: Product['min_price'];
  price_decrement?: Product['price_decrement'];
  auction_status?: Product['auction_status'];
  price_decrement_interval?: Product['price_decrement_interval'];
  created_at: string;
  starting_price?: Product['starting_price'];
  is_revenue_verified?: boolean;
  is_code_audited?: boolean;
  is_traffic_verified?: boolean;
  monthly_traffic?: number;
  gross_profit_margin?: number;
  monthly_churn_rate?: number;
  requires_nda?: boolean;
}

export function ProductContent({
  title,
  description,
  price,
  category,
  stage,
  monthlyRevenue,
  auction_end_time,
  current_price,
  min_price,
  price_decrement,
  auction_status,
  price_decrement_interval,
  created_at,
  starting_price,
  is_revenue_verified,
  is_code_audited,
  is_traffic_verified,
  monthly_traffic,
  gross_profit_margin,
  monthly_churn_rate,
  requires_nda,
}: ProductContentProps) {
  const isAuction = !!auction_end_time;
  
  // Ensure display price is a valid number
  const displayPrice = isAuction ? (current_price || price || 0) : (price || 0);
  
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

  // If NDA is required and not signed, show limited information
  if (requires_nda) {
    return (
      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          This listing requires an NDA to view complete details.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-semibold text-gray-600">
              {isAuction ? 'Auction' : 'Price'}
            </span>
            <div className="font-medium text-green-600">
              {isAuction ? "Active Auction" : formatCurrency(price || 0)}
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-600">Stage</span>
            <div>
              {stage && (
                <Badge 
                  variant="secondary" 
                  className={`${getStageColor(stage).bg} ${getStageColor(stage).text}`}
                >
                  {stage}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-sm font-semibold text-gray-600">
            {isAuction ? 'Current Price' : 'Price'}
          </span>
          <div className="font-medium text-green-600">
            {formatCurrency(displayPrice)}
          </div>
          {isAuction && starting_price && displayPrice < starting_price && (
            <div className="text-xs flex items-center text-green-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              <span>
                {Math.round(((starting_price - displayPrice) / starting_price) * 100)}% below start
              </span>
            </div>
          )}
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-600">Monthly Revenue</span>
          <div className="font-medium text-green-600">
            {monthlyRevenue ? formatCurrency(Number(monthlyRevenue)) : '-'}
          </div>
        </div>

        {(category || stage) && (
          <>
            <div>
              <span className="text-sm font-semibold text-gray-600">Stage</span>
              <div>
                {stage && (
                  <Badge 
                    variant="secondary" 
                    className={`${getStageColor(stage).bg} ${getStageColor(stage).text}`}
                  >
                    {stage}
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">Category</span>
              <div>
                {category && (
                  <Badge 
                    variant="secondary" 
                    className={`${getCategoryColor(category).bg} ${getCategoryColor(category).text}`}
                  >
                    {category}
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Additional verification badges */}
      {(is_revenue_verified || is_code_audited || is_traffic_verified) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {is_revenue_verified && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs px-2">
              Verified Revenue
            </Badge>
          )}
          {is_code_audited && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2">
              Code Audited
            </Badge>
          )}
          {is_traffic_verified && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs px-2">
              Verified Traffic
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
