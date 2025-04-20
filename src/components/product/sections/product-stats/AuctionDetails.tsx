
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface AuctionDetailsProps {
  product: {
    starting_price?: number;
    no_reserve?: boolean;
    reserve_price?: number;
    price_decrement?: number;
    price_decrement_interval?: string;
    auction_end_time?: string;
    current_price?: number;
  };
  isAuction: boolean;
}

export function AuctionDetails({ product, isAuction }: AuctionDetailsProps) {
  if (!isAuction) return null;

  // Check if this is a no reserve auction
  const isNoReserve = product.no_reserve === true;

  return (
    <div className="col-span-full">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <TrendingUp className="h-4 w-4" />
        <span>Auction Details</span>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex justify-between items-center bg-white p-2 rounded-md">
            <span className="text-gray-600">Starting Price</span>
            <span className="font-medium">{product.starting_price ? formatCurrency(product.starting_price) : "Not set"}</span>
          </div>
          
          {/* Show different reserve price display based on no_reserve flag */}
          {isNoReserve ? (
            <div className="flex justify-between items-center bg-green-50 p-2 rounded-md">
              <span className="text-gray-600">Reserve Price</span>
              <span className="font-medium text-green-600">No Reserve</span>
            </div>
          ) : (
            <div className="flex justify-between items-center bg-white p-2 rounded-md">
              <span className="text-gray-600">Reserve Price</span>
              <span className="font-medium">{product.reserve_price ? formatCurrency(product.reserve_price) : "Not set"}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center bg-white p-2 rounded-md">
            <span className="text-gray-600">Price Decrement</span>
            <span className="font-medium">{product.price_decrement ? formatCurrency(product.price_decrement) : "Not set"}</span>
          </div>
          <div className="flex justify-between items-center bg-white p-2 rounded-md">
            <span className="text-gray-600">Decrement Interval</span>
            <span className="font-medium">{product.price_decrement_interval || "Not set"}</span>
          </div>
          {product.auction_end_time && (
            <div className="flex justify-between items-center bg-white p-2 rounded-md col-span-full">
              <span className="text-gray-600">Auction End Time</span>
              <span className="font-medium">{new Date(product.auction_end_time).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-center bg-white p-2 rounded-md col-span-full">
            <span className="text-gray-600">Current Price</span>
            <span className="font-medium text-green-600">{product.current_price ? formatCurrency(product.current_price) : "Not set"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
