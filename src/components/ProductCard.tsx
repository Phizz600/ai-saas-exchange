import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ProductCardImage } from "./marketplace/product-card/ProductCardImage";
import { ProductCardContent } from "./marketplace/product-card/ProductCardContent";
import { ProductCardActions } from "./marketplace/product-card/ProductCardActions";

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
    seller: {
      id: number;
      name: string;
      avatar: string;
      achievements: {
        type: "FirstTimeBuyer" | "SuccessfulAcquisition" | "TopBidder" | "DealmakerOfMonth";
        label: string;
      }[];
    };
  };
}

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
        <ProductCardImage
          image={product.image}
          title={product.title}
          timeLeft={product.timeLeft}
          seller={product.seller}
        />
        <ProductCardContent
          title={product.title}
          description={product.description}
          price={product.price}
          category={product.category}
          stage={product.stage}
          monthlyRevenue={product.monthlyRevenue}
        />
        <ProductCardActions />
      </Card>
    </motion.div>
  );
}