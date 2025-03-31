import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { ProductHeader } from "./sections/ProductHeader";
import { ProductPricing } from "./sections/ProductPricing";
import { ProductGallery } from "./sections/ProductGallery";
import { ProductStats } from "./sections/ProductStats";
import { PriceHistoryChart } from "./sections/PriceHistoryChart";
import { ProductReviews } from "./sections/ProductReviews";
import { RelatedProducts } from "../marketplace/product-card/RelatedProducts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, ExternalLink, BadgeCheck, Timer, LockIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useNdaStatus } from "../marketplace/product-card/useNdaStatus";
import { NdaButton } from "../marketplace/product-card/NdaButton";

interface Product {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  stage: string;
  monthly_revenue?: number;
  monthly_profit?: number;
  gross_profit_margin?: number;
  monthly_churn_rate?: number;
  monthly_traffic?: number;
  special_notes?: string;
  image_url?: string;
  active_users?: string;
  is_verified?: boolean;
  is_revenue_verified?: boolean;
  is_traffic_verified?: boolean;
  tech_stack?: string[];
  tech_stack_other?: string;
  llm_type?: string;
  llm_type_other?: string;
  integrations_other?: string;
  team_size?: string;
  has_patents?: boolean;
  competitors?: string;
  demo_url?: string;
  product_age?: string;
  business_location?: string;
  number_of_employees?: string;
  customer_acquisition_cost?: number;
  monetization?: string;
  monetization_other?: string;
  business_model?: string;
  investment_timeline?: string;
  requires_nda?: boolean;
  nda_content?: string;
  seller: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function ProductPage() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const { hasSigned, isCheckingStatus, setHasSigned } = useNdaStatus(id || '');
  
  const {
    data: product,
    isLoading,
    error
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('No product ID provided');
      }
      const {
        data,
        error
      } = await supabase.from('products').select(`
          *,
          seller:seller_id(
            id,
            full_name,
            avatar_url
          )
        `).eq('id', id).single();
      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
      if (!data) {
        throw new Error('Product not found');
      }
      return data as Product;
    },
    retry: 1,
    gcTime: 0
  });

  useEffect(() => {
    if (error) {
      console.error('Query error:', error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive"
      });
      navigate('/marketplace');
    }
  }, [error, toast, navigate]);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!id) return;
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      const {
        data: likedStatus
      } = await supabase.rpc('check_product_liked', {
        check_user_id: user.id,
        check_product_id: id
      });
      setIsLiked(!!likedStatus);
    };
    checkIfLiked();
  }, [id]);

  // Handle NDA success
  const handleNdaSuccess = () => {
    setHasSigned(true);
    toast({
      title: "NDA Signed",
      description: "You now have access to the full product details",
    });
  };

  if (isLoading) {
    return <>
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Skeleton className="h-6 w-60" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <Card className="p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6 mt-2" />
              </Card>
              <Card className="p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </>;
  }

  if (!product) {
    return <>
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </>;
  }

  // Determine if we need to show limited information
  const showLimitedInfo = product?.requires_nda && !hasSigned;

  // Determine acquisition timeline text based on investment_timeline
  const getAcquisitionTimelineText = (timeline?: string) => {
    switch (timeline) {
      case 'immediate':
        return 'Ready for immediate acquisition';
      case 'within_30_days':
        return 'Available for acquisition within 30 days';
      case 'within_90_days':
        return 'Available for acquisition within 90 days';
      case 'more_than_90_days':
        return 'Planned for acquisition in the future';
      default:
        return 'Ready for acquisition';
    }
  };

  return <>
      <Header />
      
      <div className="container mx-auto px-4 py-8 mt-16 mb-16">
        {/* Breadcrumbs and back button */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Marketplace
          </Button>
          <div className="text-sm text-gray-500">
            Marketplace / {product.category} / {product.title}
          </div>
        </div>
        
        {/* NDA Banner - show only if NDA is required and not signed */}
        {showLimitedInfo && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-4"
          >
            <div className="bg-amber-100 rounded-full p-2">
              <LockIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 exo-2-heading">
                This product requires a Non-Disclosure Agreement
              </h3>
              <p className="text-amber-700 mb-4">
                Some information about this product is confidential. To view all details, you need to sign an NDA.
              </p>
              <NdaButton 
                productId={product.id} 
                productTitle={product.title}
                ndaContent={product.nda_content}
                onSignSuccess={handleNdaSuccess}
              />
            </div>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }}>
              <ProductGallery images={[product.image_url]} />
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }}>
              <Card className="p-6 border-t-4 border-t-[#D946EE]">
                <h3 className="text-lg font-semibold mb-4 exo-2-heading">Product Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium px-2 py-1 bg-[#8B5CF6]/10 rounded-md text-[#8B5CF6]">{product.category}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <span className="text-gray-600">Stage</span>
                    <span className="font-medium px-2 py-1 bg-[#0EA4E9]/10 rounded-md text-[#0EA4E9]">{product.stage}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <span className="text-gray-600">Monthly Revenue</span>
                    <span className="font-medium text-green-600">
                      {showLimitedInfo ? (
                        <span className="text-gray-400">Sign NDA to view</span>
                      ) : (
                        <>
                          ${product.monthly_revenue ? product.monthly_revenue.toLocaleString() : '0'}
                          {product.is_revenue_verified && <CheckCircle className="inline-block h-4 w-4 ml-1 text-green-500" />}
                        </>
                      )}
                    </span>
                  </div>
                  {!showLimitedInfo && product.demo_url && (
                    <a href={product.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2 mt-2 text-[#8B5CF6] border border-[#8B5CF6] rounded-md hover:bg-[#8B5CF6]/10 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                      View Live Demo
                    </a>
                  )}
                </div>
                {!showLimitedInfo && product.special_notes && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-base font-semibold mb-2">Special Notes</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{product.special_notes}</p>
                  </div>
                )}
              </Card>
            </motion.div>
            
            {!showLimitedInfo && (
              <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.5,
                delay: 0.2
              }}>
                <PriceHistoryChart productId={product.id} />
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }}>
              <ProductHeader product={{
              id: product.id,
              title: product.title,
              description: showLimitedInfo ? 
                "Sign an NDA to view the full product description and details." : 
                product.description || ''
            }} isLiked={isLiked} setIsLiked={setIsLiked} />
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }}>
              <ProductPricing product={product} />
            </motion.div>
            
            {!showLimitedInfo && (
              <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.5,
                delay: 0.2
              }}>
                <ProductStats product={product} />
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-12 space-y-8">
          {!showLimitedInfo && (
            <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: 0.3
            }}>
              <ProductReviews productId={product.id} />
            </motion.div>
          )}
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.4
        }}>
            <RelatedProducts currentProductCategory={product.category} currentProductId={product.id} />
          </motion.div>
        </div>
      </div>
    </>;
}
