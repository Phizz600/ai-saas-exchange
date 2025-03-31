
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  isAuction?: boolean;
}

export function ProductActions({ isAuction = false }: ProductActionsProps) {
  return (
    <Button 
      className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all"
    >
      {isAuction ? "Bid Now" : "Buy"}
    </Button>
  );
}
