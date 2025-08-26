import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductHeader } from "./sections/ProductHeader";
import { ProductPricing } from "./sections/ProductPricing";
import { ProductGallery } from "./sections/ProductGallery";
import { ProductStats } from "./sections/product-stats/ProductStats";
import { PriceHistoryChart } from "./sections/PriceHistoryChart";
import { ProductReviews } from "./sections/ProductReviews";
import { RelatedProducts } from "../marketplace/product-card/RelatedProducts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, ExternalLink, InfoIcon, LockIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useNdaStatus } from "../marketplace/product-card/useNdaStatus";
import { NdaButton } from "../marketplace/product-card/NdaButton";
import { NdaStatusBadge } from "../marketplace/product-card/NdaStatusBadge";
import { ConfidentialWatermark } from "../marketplace/product-card/ConfidentialWatermark";
import { incrementProductViews } from "@/integrations/supabase/product-analytics";
import { Product } from "@/types/product";

// Export as default instead of named export
export default function ProductPageContent() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  
  // Track product view when page loads
  useEffect(() => {
    const trackView = async () => {
      if (productId) {
        try {
          await incrementProductViews(productId);
          console.log("Product view tracked:", productId);
        } catch (error) {
          console.error("Error tracking product view:", error);
        }
      }
    };
    trackView();
  }, [productId]);
  
  // Ensure productId is defined before passing to useNdaStatus
  const safeProductId = productId || '';
  const { hasSigned, isCheckingStatus, setHasSigned } = useNdaStatus(safeProductId);
  
  // Fetch product data
  const {
    data: product,
    isLoading,
    error
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) {
        throw new Error('No product ID provided');
      }
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            seller:profiles(id, full_name, avatar_url)
          `)
          .eq('id', productId)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching product:', error);
          throw error;
        }
        
        if (!data) {
          throw new Error('Product not found');
        }
        
        // Ensure seller property is always present with required fields
        if (!data.seller) {
          data.seller = { 
            id: data.seller_id || '',
            full_name: 'Unknown Seller',
            avatar_url: null
          };
        }
        
        return data as Product;
      } catch (err) {
        console.error('Query execution error:', err);
        throw err;
      }
    },
    retry: 1,
    gcTime: 0
  });

  // Determine if we need to show limited information - moved after product query
  const showLimitedInfo = product?.requires_nda && !hasSigned;
  
  // Add print warning - moved after product query
  useEffect(() => {
    const handleBeforePrint = () => {
      if (product?.requires_nda) {
        alert("Warning: This document contains confidential information protected by an NDA. Unauthorized printing or distribution is prohibited.");
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    return () => window.removeEventListener('beforeprint', handleBeforePrint);
  }, [product?.requires_nda]);
  
  // Add copy protection - moved after product query
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      if (product?.requires_nda && !hasSigned) {
        e.preventDefault();
        toast({
          title: "Copy restricted",
          description: "This content is protected by NDA and cannot be copied until you sign the agreement",
          variant: "destructive",
        });
      }
    };
    
    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, [product?.requires_nda, hasSigned, toast]);

  useEffect(() => {
    if (error) {
      console.error('Query error:', error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive"
      });
      // Don't immediately redirect on error
      // Instead, stay on page and show error state
    }
  }, [error, toast]);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!productId) return;
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
        check_product_id: productId
      });
      setIsLiked(!!likedStatus);
    };
    checkIfLiked();
  }, [productId]);

  // Handle NDA success
  const handleNdaSuccess = () => {
    setHasSigned(true);
    toast({
      title: "NDA Signed",
      description: "You now have access to the full product details",
    });
  };

  if (isLoading) {
    return (
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
    );
  }

  // Show error state if product failed to load
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Marketplace
          </Button>
        </div>
        
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error loading product</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load product details. The product may not exist or has been removed."}
          </AlertDescription>
        </Alert>
        
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-8">Sorry, we couldn't find the product you're looking for.</p>
          <Button onClick={() => navigate('/product-dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Main content rendering with the fetched product
  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-16">
      {/* Breadcrumbs and back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Marketplace
          </Button>
          <div className="text-sm text-gray-500">
            Marketplace / {product.category} / {product.title}
          </div>
        </div>
        
        {/* Show NDA Status Badge if signed */}
        {product.requires_nda && hasSigned && (
          <NdaStatusBadge productId={product.id} showTimestamp={true} />
        )}
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
      
      {/* Show signed NDA reminder alert for signed users */}
      {product.requires_nda && hasSigned && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Confidentiality Notice</AlertTitle>
          <AlertDescription className="text-blue-700">
            The information on this page is protected under a signed NDA. Unauthorized sharing or distribution is prohibited.
          </AlertDescription>
        </Alert>
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
          }} className="relative">
            <ProductGallery images={[product.image_url]} />
            
            {/* Add watermark for NDA content that has been signed */}
            {product.requires_nda && hasSigned && (
              <ConfidentialWatermark />
            )}
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
                <div className="mt-4 border-t pt-4 relative">
                  <h4 className="text-base font-semibold mb-2">Special Notes</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{product.special_notes}</p>
                  
                  {/* Add subtle watermark for signed NDA content */}
                  {product.requires_nda && hasSigned && (
                    <ConfidentialWatermark opacity={0.05} />
                  )}
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
            }} className="relative">
              {/* Fix the TypeScript error by ensuring the seller's full_name property is handled properly */}
              <ProductStats product={{
                ...product,
                seller: {
                  ...product.seller,
                  full_name: product.seller?.full_name || 'Unknown Seller'
                }
              }} />
              
              {/* Add watermark for NDA content */}
              {product.requires_nda && hasSigned && (
                <ConfidentialWatermark opacity={0.05} />
              )}
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
          }} className="relative">
            <ProductReviews productId={product.id} />
            
            {/* Add watermark for NDA content */}
            {product.requires_nda && hasSigned && (
              <ConfidentialWatermark opacity={0.03} />
            )}
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
      
      {/* Footer NDA reminder - add subtle NDA status at the bottom */}
      {product.requires_nda && hasSigned && (
        <div className="mt-10 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500 italic">
            Remember: All information on this page is covered by the NDA you signed. Last accessed: {new Date().toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
