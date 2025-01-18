import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Trophy, BadgeCheck, BadgeDollarSign, Shield, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

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

const getAchievementStyles = (type: Achievement["type"]) => {
  switch (type) {
    case "FirstTimeBuyer":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "SuccessfulAcquisition":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "TopBidder":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "DealmakerOfMonth":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200";
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
      <HoverCardContent 
        side="right" 
        align="start" 
        sideOffset={10}
        className="w-80 bg-card shadow-lg border border-gray-200/50 backdrop-blur-xl"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={seller.avatar} />
              <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold">{seller.name}</h4>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <BadgeCheck className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>4.9/5 (124 reviews)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Member since Jan 2024</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Identity verified</span>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="text-sm font-medium">Achievements</h5>
            <div className="flex flex-wrap gap-1">
              {seller.achievements.map((achievement, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={cn(
                    "flex items-center gap-1 text-xs",
                    getAchievementStyles(achievement.type)
                  )}
                >
                  {getAchievementIcon(achievement.type)}
                  {achievement.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">
                <span className="font-medium">15</span> successful deals
              </div>
              <div className="text-gray-600">
                <span className="font-medium">98%</span> positive feedback
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}