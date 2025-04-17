
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
    highest_bid?: number;
    highest_bidder_id?: string;
  };
}

export function AuctionSection({ product }: AuctionSectionProps) {
  const isAuctionEnded = product.auction_end_time && new Date(product.auction_end_time) < new Date();
  const hasWinner = !!product.highest_bid && !!product.highest_bidder_id;
  
  // If auction has ended, show appropriate message
  if (isAuctionEnded) {
    return (
      <div className="w-full p-3 text-center bg-gray-100 rounded-md">
        <p className="text-sm font-medium">
          {hasWinner 
            ? `Auction ended with winning bid: $${product.highest_bid?.toLocaleString()}` 
            : "Auction has ended without bids"}
        </p>
      </div>
    );
  }
  
  // If auction has a winner but hasn't technically ended yet (due to timing)
  if (hasWinner) {
    return (
      <div className="w-full p-3 text-center bg-amber-50 rounded-md">
        <p className="text-sm font-medium text-amber-800">
          Auction completed with winning bid: ${product.highest_bid?.toLocaleString()}
        </p>
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
