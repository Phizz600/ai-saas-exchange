import { MessageSquare, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

export function ProductCardActions() {
  return (
    <CardFooter className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2 w-full">
        <Button 
          variant="outline"
          className="w-full hover:bg-gray-50"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact
        </Button>
        <Button 
          variant="outline"
          className="w-full hover:bg-gray-50"
        >
          <Eye className="h-4 w-4 mr-2" />
          Details
        </Button>
      </div>
      <Button 
        className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white"
      >
        Open Pitch Deck
      </Button>
    </CardFooter>
  );
}