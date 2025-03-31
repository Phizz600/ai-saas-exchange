
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Database } from "@/integrations/supabase/types";
import { Timer, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

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
  min_price?: Product['min_price'];
  price_decrement?: Product['price_decrement'];
  price_decrement_interval?: Product['price_decrement_interval'];
  auction_status?: Product['auction_status'];
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
  min_price,
  price_decrement,
  price_decrement_interval,
  auction_status,
}: ProductCardContentProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [nextDrop, setNextDrop] = useState<string>('');
  const isAuction = !!auction_end_time;
  
  // Calculate the interval in milliseconds
  const getIntervalInMilliseconds = () => {
    const interval = price_decrement_interval || 'day';
    switch(interval) {
      case 'minute': return 60 * 1000;
      case 'hour': return 60 * 60 * 1000;
      case 'day': return 24 * 60 * 60 * 1000;
      case 'week': return 7 * 24 * 60 * 60 * 1000;
      case 'month': return 30 * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000;
    }
  };
  
  useEffect(() => {
    if (!auction_end_time) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(auction_end_time).getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft('Auction ended');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      
      // Calculate next price drop
      const interval = getIntervalInMilliseconds();
      const nextDropTime = Math.ceil(now / interval) * interval;
      const timeToNextDrop = nextDropTime - now;
      
      // Format the next drop time
      const nextDropHours = Math.floor(timeToNextDrop / (1000 * 60 * 60));
      const nextDropMinutes = Math.floor((timeToNextDrop % (1000 * 60 * 60)) / (1000 * 60));
      
      if (nextDropHours > 0) {
        setNextDrop(`${nextDropHours}h ${nextDropMinutes}m`);
      } else {
        setNextDrop(`${nextDropMinutes}m`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [auction_end_time]);

  // Format the price decrement to show the correct interval
  const formatPriceDecrement = () => {
    if (!price_decrement) return "";
    
    const interval = price_decrement_interval || 'day';
    return `$${price_decrement.toLocaleString()}/${interval}`;
  };

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
                {formatCurrency(current_price || price)}
                {min_price && (
                  <span className="text-sm text-gray-500 ml-1">
                    (Min: {formatCurrency(min_price)})
                  </span>
                )}
              </>
            ) : (
              formatCurrency(price)
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
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Timer className="h-4 w-4" />
                <span>{timeLeft}</span>
              </div>
              
              {price_decrement && (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <TrendingDown className="h-4 w-4" />
                  <span>Drops {formatPriceDecrement()}</span>
                </div>
              )}
              
              {nextDrop && (
                <div className="text-sm text-amber-600">
                  Next drop in: {nextDrop}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
