import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Trophy, BadgeCheck, BadgeDollarSign } from "lucide-react";

interface Achievement {
  type: "FirstTimeBuyer" | "SuccessfulAcquisition" | "TopBidder" | "DealmakerOfMonth";
  label: string;
}

interface SellerHoverCardProps {
  seller: {
    name: string;
    avatar: string;
    achievements: Achievement[];
  };
}

const getAchievementIcon = (type: Achievement["type"]) => {
  switch (type) {
    case "FirstTimeBuyer":
      return <Award className="h-4 w-4" />;
    case "SuccessfulAcquisition":
      return <Trophy className="h-4 w-4" />;
    case "TopBidder":
      return <BadgeCheck className="h-4 w-4" />;
    case "DealmakerOfMonth":
      return <BadgeDollarSign className="h-4 w-4" />;
  }
};

export function SellerHoverCard({ seller }: SellerHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 p-1 bg-white/10 backdrop-blur-md hover:bg-white/20"
        >
          <Avatar className="h-8 w-8 ring-2 ring-white/50">
            <AvatarImage src={seller.avatar} alt={seller.name} />
            <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-white/90 backdrop-blur-xl border-gray-200/50">
        <div className="flex justify-between space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={seller.avatar} />
            <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{seller.name}</h4>
            <div className="flex flex-wrap gap-1">
              {seller.achievements.map((achievement, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 text-xs bg-gray-100/80"
                >
                  {getAchievementIcon(achievement.type)}
                  {achievement.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}