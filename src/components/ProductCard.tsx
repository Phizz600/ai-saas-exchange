import { Heart, Clock } from "lucide-react";
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
  };
}

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
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-gray-900">{product.title}</CardTitle>
              <CardDescription className="text-gray-500">
                {product.category}
              </CardDescription>
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