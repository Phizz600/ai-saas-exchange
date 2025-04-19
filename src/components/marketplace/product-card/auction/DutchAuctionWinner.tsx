
interface DutchAuctionWinnerProps {
  winningBid: number;
}

export function DutchAuctionWinner({ winningBid }: DutchAuctionWinnerProps) {
  return (
    <div className="w-full p-3 text-center bg-amber-50 rounded-md">
      <p className="text-sm font-medium text-amber-800">
        Auction completed with winning bid: ${winningBid.toLocaleString()}
      </p>
    </div>
  );
}
