import { ProductBadges } from "./ProductBadges";
import { ProductMetrics } from "./ProductMetrics";
import { formatCurrency } from "@/lib/utils";
import { AuctionTimer } from "./auction/AuctionTimer";

interface ProductContentProps {
  title: string;
  description?: string;
  price?: number;
  current_price?: number;
  category?: string;
  stage?: string;
  monthlyRevenue?: number;
  monthly_traffic?: number;
  gross_profit_margin?: number;
  monthly_churn_rate?: number;
  is_revenue_verified?: boolean;
  is_code_audited?: boolean;
  is_traffic_verified?: boolean;
  requires_nda?: boolean;
  auction_end_time?: string;
  reserve_price?: number;
  price_decrement?: number;
  price_decrement_interval?: string;
  no_reserve?: boolean;
  listing_type?: string;
  updated_at?: string;
}

export function ProductContent({
  title,
  description,
  price,
  current_price,
  category,
  stage,
  monthlyRevenue,
  monthly_traffic,
  gross_profit_margin,
  monthly_churn_rate,
  is_revenue_verified,
  is_code_audited,
  is_traffic_verified,
  requires_nda,
  auction_end_time,
  reserve_price,
  price_decrement,
  price_decrement_interval,
  no_reserve,
  listing_type,
  updated_at
}: ProductContentProps) {
  // Ensure price values are either valid numbers or 0
  const displayPrice = (current_price || price || 0);
  const isAuction = listing_type === 'dutch_auction' || !!auction_end_time;
  
  // Check if this is a no-reserve auction
  const isNoReserve = no_reserve || !reserve_price || reserve_price === 0;
  
  return (
    <div className="p-0 space-y-0">
      {/* Add the AuctionTimer component for auction products */}
      {isAuction && (
        <AuctionTimer 
          auctionEndTime={auction_end_time}
          currentPrice={current_price}
          reservePrice={reserve_price}
          priceDecrement={price_decrement}
          decrementInterval={price_decrement_interval}
          noReserve={isNoReserve}
          isDutchAuction={listing_type === 'dutch_auction'}
          updatedAt={updated_at}
        />
      )}
      
      <div className="p-5 space-y-4">
        {/* Category & Stage Pills at the top */}
        <ProductBadges category={category} stage={stage} requiresNda={requires_nda} />
        
        {/* Title - Modified to show "Confidential" for NDA-required products */}
        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#8B5CF6] transition-colors duration-200 exo-2-heading">
          {requires_nda ? "Confidential" : title}
        </h3>
        
        {/* Description */}
        {description && !requires_nda && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}
        
        {/* NDA message if required */}
        {requires_nda && (
          <p className="text-sm text-gray-600 italic">
            Additional details available after signing NDA
          </p>
        )}
        
        {/* Price display */}
        <div className="text-xl font-bold text-green-600 text-left">
          {formatCurrency(displayPrice)}
          {isAuction && (
            <span className="text-sm font-normal text-amber-600 ml-1">
              (Current bid)
            </span>
          )}
        </div>
        
        {/* Auction status - only show if it's an auction */}
        {isAuction && (
          <div className="text-sm text-gray-600">
            {isNoReserve ? (
              <span className="text-amber-600">No Reserve - Sells at any price</span>
            ) : (
              <span>With Reserve</span>
            )}
          </div>
        )}
        
        {/* Show metrics for ALL products */}
        <ProductMetrics 
          monthlyRevenue={monthlyRevenue}
          monthly_traffic={monthly_traffic}
          gross_profit_margin={gross_profit_margin}
          monthly_churn_rate={monthly_churn_rate}
          is_revenue_verified={is_revenue_verified}
          is_code_audited={is_code_audited}
          is_traffic_verified={is_traffic_verified}
        />
      </div>
    </div>
  );
}
