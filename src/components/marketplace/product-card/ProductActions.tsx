
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProductActionsProps {
  isAuction?: boolean;
  productId: string;
  showInteractionLimits?: boolean;
}

export function ProductActions({ isAuction = false, productId, showInteractionLimits = false }: ProductActionsProps) {
  if (showInteractionLimits) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              className="w-full bg-gradient-to-r from-muted to-muted hover:opacity-90 text-muted-foreground font-medium shadow-md transition-all cursor-not-allowed"
              disabled
            >
              {isAuction ? "Bid Now" : "Buy"} - Premium Required
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upgrade to Premium to interact with listings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button 
      className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all"
      asChild
    >
      <Link to={`/product/${productId}`}>
        {isAuction ? "Bid Now" : "Buy"}
      </Link>
    </Button>
  );
}
