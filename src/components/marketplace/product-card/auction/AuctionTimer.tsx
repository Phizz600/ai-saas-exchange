import { Clock, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
interface AuctionTimerProps {
  auctionEndTime?: string;
  currentPrice?: number;
  reservePrice?: number;
  priceDecrement?: number;
  decrementInterval?: string;
  noReserve?: boolean;
}
export function AuctionTimer({
  auctionEndTime,
  currentPrice,
  reservePrice,
  priceDecrement,
  decrementInterval,
  noReserve
}: AuctionTimerProps) {
  if (!auctionEndTime) return null;
  return <div className="bg-amber-50 rounded-t-md p-3 border-b border-amber-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-amber-800">
          <TrendingDown className="h-4 w-4 mr-1.5" />
          <span className="text-sm font-medium">Dutch Auction</span>
        </div>
        {priceDecrement && decrementInterval && <div className="text-xs text-amber-700">
            Drops ${priceDecrement} per {decrementInterval}
          </div>}
      </div>
      
      <div className="mt-2 text-xs text-amber-700">
        
        
        
        
      </div>
      
      {noReserve && <div className="mt-1 text-xs text-amber-700 flex items-center">
          <span className="bg-amber-200 text-amber-800 text-xs px-1.5 py-0.5 rounded">No Reserve</span>
          <span className="ml-1">Sells at any price!</span>
        </div>}
      
      {!noReserve && reservePrice && reservePrice > 0 && <div className="mt-1 text-xs text-amber-700">
          Reserve price: {formatCurrency(reservePrice)}
        </div>}
    </div>;
}