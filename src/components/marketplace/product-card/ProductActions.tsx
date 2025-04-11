
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

interface ProductActionsProps {
  isAuction?: boolean;
  productId: string;
  demoUrl?: string;
}

export function ProductActions({ isAuction = false, productId, demoUrl }: ProductActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button 
        className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all"
        asChild
      >
        <Link to={`/product/${productId}`}>
          {isAuction ? "Bid Now" : "Buy"}
        </Link>
      </Button>
      
      {demoUrl && (
        <Button 
          variant="outline" 
          className="w-full border-gray-200 hover:border-purple-200 transition-all"
          asChild
        >
          <a href={demoUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Demo
          </a>
        </Button>
      )}
    </div>
  );
}
