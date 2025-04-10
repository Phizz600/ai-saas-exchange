
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Database } from "@/integrations/supabase/types";
import { Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuctionPricing } from "./useAuctionPricing";

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardContentProps {
  title: Product['title'];
  description: Product['description'];
  price: Product['price'];
  category: Product['category'];
  stage: Product['stage'];
  monthlyRevenue: Product['monthly_revenue'];
  auction_end_time?: Product['auction_end_time'];
  current_price?: Product['current_price'];
  reserve_price?: Product['min_price']; // Changed from min_price to reserve_price
  price_decrement?: Product['price_decrement'];
  auction_status?: Product['auction_status'];
  price_decrement_interval?: Product['price_decrement_interval'];
  created_at: string;
  starting_price?: Product['starting_price'];
  no_reserve?: boolean; // Added no_reserve field
}

export function ProductCardContent({
  title,
  description,
  price,
  category,
  stage,
  monthlyRevenue,
  auction_end_time,
  current_price,
  reserve_price, // Changed from min_price to reserve_price
  price_decrement,
  auction_status,
  price_decrement_interval,
  created_at,
  starting_price,
  no_reserve,
}: ProductCardContentProps) {
  const isAuction = !!auction_end_time;
  const { timeLeft, currentPrice, isAuctionEnded } = useAuctionPricing({
    auction_end_time,
    starting_price,
    current_price,
    reserve_price, // Changed from min_price to reserve_price
    price_decrement,
    price_decrement_interval,
    created_at,
    no_reserve,
  });
  
  // Ensure display price is a valid number
  const displayPrice = isAuction ? (currentPrice || current_price || price || 0) : (price || 0);
  
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

  // Format the price decrement interval for display
  const formatDecrementInterval = (interval?: string) => {
    if (!interval) return "hour"; // Default
    
    switch(interval) {
      case "minute": return "minute";
      case "hour": return "hour";
      case "day": return "day";
      case "week": return "week";
      case "month": return "month";
      default: return interval;
    }
  };

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
            {isAuction ? (
              <>
                {formatCurrency(displayPrice)}
                {!no_reserve && reserve_price !== undefined && reserve_price !== null && (
                  <span className="text-sm text-gray-500 ml-1">
                    (Min: {formatCurrency(reserve_price)})
                  </span>
                )}
              </>
            ) : (
              formatCurrency(price || 0)
            )}
          </div>
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-600">Monthly Revenue</span>
          <div className="font-medium text-green-600">
            {monthlyRevenue ? formatCurrency(Number(monthlyRevenue)) : '-'}
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
      </div>

      {isAuction && (
        <div className="mt-4 space-y-2">
          <Badge 
            variant="secondary" 
            className="bg-amber-100 text-amber-700"
          >
            Dutch Auction
          </Badge>
          
          {timeLeft && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Timer className="h-4 w-4" />
              <span>{timeLeft}</span>
              {price_decrement !== undefined && price_decrement !== null && price_decrement_interval && (
                <span className="text-amber-600 ml-2">
                  Drops {formatCurrency(price_decrement)}/{formatDecrementInterval(price_decrement_interval)}
                </span>
              )}
            </div>
          )}
          
          {no_reserve && (
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
              No Reserve
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
