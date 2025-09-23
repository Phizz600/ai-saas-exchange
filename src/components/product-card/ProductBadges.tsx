
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";

interface ProductBadgesProps {
  category: string;
  stage: string;
  auctionEndTime?: string;
}

export function ProductBadges({ category, stage, auctionEndTime }: ProductBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
        {category}
      </Badge>
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        {stage}
      </Badge>
    </div>
  );
}
