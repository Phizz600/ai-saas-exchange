
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, Users, Star, History, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    description: string;
    price?: number;
    category: string;
    stage: string;
    monthlyRevenue?: number;
    monthlyTraffic?: number;
    grossProfitMargin?: number;
    monthlyChurnRate?: number;
    image: string;
    isAuction?: boolean;
    currentPrice?: number;
    minPrice?: number;
    timeLeft?: string;
  };
  isAuthenticated: boolean;
  handleAuthRedirect: () => void;
}

export const ProductCard = ({ 
  product, 
  isAuthenticated, 
  handleAuthRedirect 
}: ProductCardProps) => {
  return (
    <motion.div 
      key={product.id} 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }} 
      className="h-full"
    >
      <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-gray-100/20">
        <div className="relative h-48">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover" 
          />
          {product.isAuction && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                <TrendingDown className="w-4 h-4 mr-1" />
                Dutch Auction
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-exo text-xl font-semibold text-gray-900 mb-2">
              {product.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {product.category}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {product.stage}
              </Badge>
            </div>
          </div>

          <ProductCardDetails product={product} />

          <div className="pt-4 space-y-2">
            <ProductCardButtons 
              product={product} 
              isAuthenticated={isAuthenticated} 
              handleAuthRedirect={handleAuthRedirect} 
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const ProductCardDetails = ({ product }: { product: ProductCardProps['product'] }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-semibold text-green-600">
          {product.isAuction 
            ? formatCurrency(product.currentPrice || 0) 
            : formatCurrency(product.price || 0)}
        </span>
        {product.isAuction && product.minPrice && (
          <span className="text-sm text-gray-500">
            (Min: {formatCurrency(product.minPrice)})
          </span>
        )}
      </div>

      {product.monthlyRevenue && (
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span>MRR: {formatCurrency(product.monthlyRevenue)}</span>
        </div>
      )}

      {product.monthlyTraffic && (
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4 text-blue-500" />
          <span>{product.monthlyTraffic.toLocaleString()} monthly visitors</span>
        </div>
      )}
      
      {product.grossProfitMargin && (
        <div className="flex items-center gap-2 text-gray-600">
          <Star className="w-4 h-4 text-amber-500" />
          <span>{product.grossProfitMargin}% profit margin</span>
        </div>
      )}

      {typeof product.monthlyChurnRate === 'number' && (
        <div className="flex items-center gap-2 text-gray-600">
          <History className="w-4 h-4 text-purple-500" />
          <span>{product.monthlyChurnRate}% monthly churn</span>
        </div>
      )}
    </div>
  );
};

const ProductCardButtons = ({ 
  product, 
  isAuthenticated, 
  handleAuthRedirect 
}: ProductCardProps) => {
  return (
    <>
      {product.isAuction ? (
        isAuthenticated ? (
          <Button className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white cursor-not-allowed shadow-md disabled:opacity-90 disabled:shadow-none" disabled>
            Place Bid
          </Button>
        ) : (
          <Button className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all" onClick={handleAuthRedirect}>
            Place Bid
          </Button>
        )
      ) : (
        isAuthenticated ? (
          <Button className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white cursor-not-allowed shadow-md disabled:opacity-90 disabled:shadow-none" disabled>
            Buy Now
          </Button>
        ) : (
          <Button className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all" onClick={handleAuthRedirect}>
            Buy
          </Button>
        )
      )}
      
      {isAuthenticated ? (
        <Button variant="outline" className="w-full border-2 opacity-75 cursor-not-allowed" disabled>
          Make an Offer
        </Button>
      ) : (
        <Button variant="outline" className="w-full border-2 hover:bg-gray-50 hover:border-purple-200 transition-all" onClick={handleAuthRedirect}>
          Make an Offer
        </Button>
      )}

      {isAuthenticated ? (
        <Button variant="ghost" className="w-full opacity-75 cursor-not-allowed" disabled>
          View Details
        </Button>
      ) : (
        <Button variant="ghost" className="w-full hover:bg-gray-50 hover:text-purple-600 transition-all" onClick={handleAuthRedirect}>
          View Details
        </Button>
      )}
    </>
  );
};
