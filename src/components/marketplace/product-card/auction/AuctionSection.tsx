
import { AuctionTimer } from "./AuctionTimer";
import { AuctionEndedState } from "./AuctionEndedState";
import { DutchAuctionWinner } from "./DutchAuctionWinner";
import { useAuctionState } from "@/hooks/auctions/useAuctionState";

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
    listing_type?: string;
    updated_at?: string;
  };
}

export function AuctionSection({ product }: AuctionSectionProps) {
  // Check if we're dealing with a Dutch auction
  const isDutchAuction = product.listing_type === 'dutch_auction' || 
    (!!product.price_decrement && !!product.price_decrement_interval);
  
  const { isAuctionEnded, hasWinner } = useAuctionState({
    auctionEndTime: product.auction_end_time,
    currentPrice: product.current_price,
    reservePrice: product.reserve_price,
    noReserve: product.no_reserve,
    isDutchAuction,
    highestBid: product.highest_bid,
    highestBidderId: product.highest_bidder_id
  });
  
  // If auction has ended, show appropriate message
  if (isAuctionEnded) {
    return (
      <AuctionEndedState 
        hasWinner={hasWinner}
        winningBid={product.highest_bid}
      />
    );
  }
  
  // If auction has a winner (in a Dutch auction, the first valid bid wins)
  if (isDutchAuction && hasWinner) {
    return (
      <DutchAuctionWinner 
        winningBid={product.highest_bid!}
      />
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
      isDutchAuction={isDutchAuction}
      updatedAt={product.updated_at}
    />
  );
}
