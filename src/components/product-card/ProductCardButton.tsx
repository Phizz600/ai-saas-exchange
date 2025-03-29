
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface ProductCardButtonProps {
  isLoading: boolean;
  onView?: () => void;
}

export function ProductCardButton({ isLoading, onView }: ProductCardButtonProps) {
  return (
    <Button 
      className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
      onClick={(e) => {
        e.preventDefault();
        onView?.();
      }}
      disabled={isLoading}
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      Make an Offer
    </Button>
  );
}
