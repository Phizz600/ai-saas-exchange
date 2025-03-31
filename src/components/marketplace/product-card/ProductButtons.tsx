
import { Button } from "@/components/ui/button";

interface ProductButtonsProps {
  isAuction: boolean;
}

export function ProductButtons({ isAuction }: ProductButtonsProps) {
  return (
    <div className="p-5 pt-0 space-y-2">
      <Button 
        className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all"
      >
        {isAuction ? "Bid Now" : "Buy"}
      </Button>
      
      <Button 
        variant="outline"
        className="w-full border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
      >
        Make an Offer
      </Button>
      
      <Button 
        variant="ghost"
        className="w-full text-gray-500 hover:text-gray-700 font-medium"
      >
        View Details
      </Button>
    </div>
  );
}
