import { Heart } from "lucide-react";
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
      <Card className="overflow-hidden bg-white/10 backdrop-blur-lg border-white/10">
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
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-white">{product.title}</CardTitle>
              <CardDescription className="text-gray-400">
                {product.category}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                ${product.price.toLocaleString()}
              </div>
              {product.stage === "Revenue" && (
                <div className="text-sm text-green-400">
                  ${product.monthlyRevenue.toLocaleString()}/mo
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">{product.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="secondary" className="w-full">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}