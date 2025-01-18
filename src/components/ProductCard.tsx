import { Heart, Clock, Trophy, Award, BadgeCheck, BadgeDollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  type: "FirstTimeBuyer" | "SuccessfulAcquisition" | "TopBidder" | "DealmakerOfMonth";
  label: string;
}

interface Seller {
  id: number;
  name: string;
  avatar: string;
  achievements: Achievement[];
}

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    stage: string;
    monthlyRevenue: number;
    image: string;
    timeLeft: string;
    seller: Seller;
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

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden bg-white border-gray-100">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="object-cover w-full h-full"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-white hover:text-primary"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {product.timeLeft}
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 left-2 p-1"
              >
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                  <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-white border border-gray-200">
              <div className="flex justify-between space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={product.seller.avatar} />
                  <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{product.seller.name}</h4>
                  <div className="flex flex-wrap gap-1">
                    {product.seller.achievements.map((achievement, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 text-xs"
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
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-gray-900">{product.title}</CardTitle>
              <div className="flex gap-2 items-center mt-1">
                <CardDescription className="text-gray-500">
                  {product.category}
                </CardDescription>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {product.stage}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                ${product.price.toLocaleString()}
              </div>
              {product.stage === "Revenue" && (
                <div className="text-sm text-green-500">
                  ${product.monthlyRevenue.toLocaleString()}/mo
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{product.description}</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            variant="secondary" 
            className="w-full bg-[#0EA4E9] hover:bg-[#0EA4E9]/90 text-white"
          >
            View Details
          </Button>
          <Button 
            variant="secondary" 
            className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white"
          >
            Open Pitch Deck
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}