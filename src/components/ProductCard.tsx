import { Heart, Clock, Trophy, Award, BadgeCheck, BadgeDollarSign, Eye, MessageSquare, Bookmark } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
      className="group"
    >
      <Card className="overflow-hidden bg-gradient-to-b from-white to-gray-50/50 backdrop-blur-xl border-gray-100/50 shadow-lg">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
            >
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-md">
              <Clock className="h-4 w-4 mr-1" />
              {product.timeLeft}
            </Badge>
            <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-md">
              <Eye className="h-4 w-4 mr-1" />
              2.5k views
            </Badge>
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 left-2 p-1 bg-white/10 backdrop-blur-md hover:bg-white/20"
              >
                <Avatar className="h-8 w-8 ring-2 ring-white/50">
                  <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                  <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-white/90 backdrop-blur-xl border-gray-200/50">
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
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                {product.title}
              </CardTitle>
              <div className="flex gap-2 items-center mt-1">
                <Badge variant="outline" className="text-xs font-medium">
                  {product.category}
                </Badge>
                <Badge 
                  variant="secondary"
                  className={cn(
                    "text-xs font-medium",
                    product.stage === "Revenue" && "bg-green-100 text-green-800",
                    product.stage === "MVP" && "bg-blue-100 text-blue-800",
                    product.stage === "Pre-Revenue" && "bg-orange-100 text-orange-800"
                  )}
                >
                  {product.stage}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                ${product.price.toLocaleString()}
              </div>
              {product.stage === "Revenue" && (
                <div className="text-sm text-green-600 font-medium">
                  ${product.monthlyRevenue.toLocaleString()}/mo
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 line-clamp-2">{product.description}</p>
        </CardContent>
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
      </Card>
    </motion.div>
  );
}
