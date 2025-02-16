
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

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', id);
        if (!id) {
          console.error('No product ID provided');
          navigate('/marketplace');
          return;
        }

        // First fetch the product
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (productError) {
          console.error('Error fetching product:', productError);
          throw productError;
        }

        if (!product) {
          toast({
            title: "Product not found",
            description: "The product you're looking for doesn't exist or has been removed.",
            variant: "destructive",
          });
          navigate('/marketplace');
          return;
        }

        // Set default seller info first
        let productWithSeller = {
          ...product,
          seller: {
            id: product.seller_id,
            full_name: "Unknown Seller",
            avatar_url: "/placeholder.svg"
          }
        };

        setProduct(productWithSeller);

        try {
          // Then try to fetch the seller profile
          const { data: seller } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', product.seller_id)
            .maybeSingle();

          if (seller) {
            productWithSeller = {
              ...productWithSeller,
              seller
            };
            setProduct(productWithSeller);
          }
        } catch (sellerError) {
          console.error('Error fetching seller:', sellerError);
          // Continue with default seller info
        }

        // Subscribe to real-time changes
        const channel = supabase
          .channel('product-updates')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'products',
              filter: `id=eq.${id}`
            },
            (payload) => {
              console.log('Product updated:', payload);
              setProduct(current => ({
                ...payload.new,
                seller: current.seller
              }));
            }
          )
          .subscribe();

        // Check if product is liked by current user
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', user.id)
              .maybeSingle();

            if (!profileError && profile) {
              const { data: likedData, error: likedError } = await supabase
                .rpc('is_product_liked', { user_id: user.id, product_id: id });

              if (!likedError && likedData !== null) {
                setIsLiked(likedData);
              }
            }
          }
        } catch (likedError) {
          console.error('Error checking liked status:', likedError);
          // Continue without liked status
        }

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast, navigate]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16">
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
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Image */}
          <div className="space-y-6">
            <ProductGallery images={[product.image_url]} />
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Product Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stage</span>
                  <span className="font-medium">{product.stage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Revenue</span>
                  <span className="font-medium">
                    ${product.monthly_revenue ? product.monthly_revenue.toLocaleString() : '0'}
                  </span>
                </div>
                {product.special_notes && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-base font-semibold mb-2">Special Notes</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{product.special_notes}</p>
                  </div>
                )}
              </div>
            </Card>
            <PriceHistoryChart productId={product.id} />
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            <ProductHeader 
              product={product}
              isLiked={isLiked}
              setIsLiked={setIsLiked}
            />
            <ProductPricing product={product} />
            <ProductStats product={product} />
          </div>
        </div>

        <div className="mt-12 space-y-8">
          <ProductReviews productId={product.id} />
          <RelatedProducts 
            currentProductCategory={product.category}
            currentProductId={product.id}
          />
        </div>
      </div>
    </>
  );
}
