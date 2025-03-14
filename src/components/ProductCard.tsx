
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SaveProduct } from "./product-card/SaveProduct";
import { ProductMetrics } from "./product-card/ProductMetrics";
import { ProductBadges } from "./product-card/ProductBadges";
import { useProductAnalytics } from "./product-card/ProductAnalytics";
import { ProductCardButton } from "./product-card/ProductCardButton";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    stage: string;
    monthlyRevenue: number;
    image: string;
    timeLeft?: string;
    auction_end_time?: string;
    starting_price?: number;
    current_price?: number;
    min_price?: number;
    price_decrement?: number;
    seller: {
      id: string;
      name: string;
      avatar: string;
      achievements: {
        type: "FirstTimeBuyer" | "SuccessfulAcquisition" | "TopBidder" | "DealmakerOfMonth";
        label: string;
      }[];
    };
  };
  onView?: () => void;
}

export function ProductCard({ product, onView }: ProductCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { handleCardClick } = useProductAnalytics({ productId: product.id });
  const saveProduct = SaveProduct({ productId: product.id });

  useEffect(() => {
    let mounted = true;

    const checkIfSaved = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }

        if (!session?.user) {
          console.log('No authenticated user');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('saved_products')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          return;
        }

        if (mounted && profile?.saved_products?.includes(product.id)) {
          setIsSaved(true);
        }
      } catch (error) {
        console.error('Error checking saved status:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkIfSaved();

    return () => {
      mounted = false;
    };
  }, [product.id]);

  const growthRate = "30%";
  const activeUsers = "2K";

  return (
    <Link to={`/product/${product.id}`} onClick={handleCardClick}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
          <div className="relative h-48">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.auction_end_time && (
              <ProductBadges 
                category={product.category} 
                stage={product.stage} 
                auctionEndTime={product.auction_end_time} 
              />
            )}
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-exo text-xl font-semibold text-gray-900 mb-2">
                {product.title}
              </h3>
              
              {!product.auction_end_time && (
                <ProductBadges 
                  category={product.category} 
                  stage={product.stage} 
                />
              )}
            </div>

            <ProductMetrics 
              growthRate={growthRate} 
              monthlyRevenue={product.monthlyRevenue} 
            />

            <div className="pt-4">
              <ProductCardButton 
                isLoading={isLoading} 
                onView={onView} 
              />
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
