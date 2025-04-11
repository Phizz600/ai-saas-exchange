
import { AuctionTimer } from "./AuctionTimer";

interface AuctionSectionProps {
  product: {
    id: string;
    title: string;
    auction_end_time?: string;
    current_price?: number;
    reserve_price?: number;
    price_decrement?: number;
    price_decrement_interval?: string;
    no_reserve?: boolean;
  };
}

export function AuctionSection({ product }: AuctionSectionProps) {
  const isAuctionEnded = product.auction_end_time && new Date(product.auction_end_time) < new Date();
  
  // If auction has ended, don't show the timer
  if (isAuctionEnded) {
    return (
      <div className="w-full p-3 text-center bg-gray-100 rounded-md">
        <p className="text-sm font-medium">Auction has ended</p>
      </div>
    );
  }
  
  return (
    <AuctionTimer 
      auctionEndTime={product.auction_end_time}
      currentPrice={product.current_price}
      reservePrice={product.reserve_price}
      priceDecrement={product.price_decrement}
      decrementInterval={product.price_decrement_interval}
      noReserve={product.no_reserve}
    />
  );
}
