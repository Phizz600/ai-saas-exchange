
interface AuctionEndedStateProps {
  hasWinner: boolean;
  winningBid?: number;
}

export function AuctionEndedState({ hasWinner, winningBid }: AuctionEndedStateProps) {
  return (
    <div className="w-full p-3 text-center bg-gray-100 rounded-md">
      <p className="text-sm font-medium">
        {hasWinner 
          ? `Auction ended with winning bid: $${winningBid?.toLocaleString()}` 
          : "Auction has ended without bids"}
      </p>
    </div>
  );
}
