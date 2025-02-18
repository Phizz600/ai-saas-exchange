
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
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface Seller {
  id: string;
  full_name: string;
  avatar_url: string;
}

interface Product {
  id: string;
  seller_id: string;
  title: string;
  description: string;
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
  seller: Seller;
}

type DatabaseProduct = {
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
};

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        console.error('No product ID provided');
        navigate('/marketplace');
        return;
      }

      try {
        const { data, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (productError) throw productError;

        if (!data) {
          toast({
            title: "Product not found",
            description: "The product you're looking for doesn't exist or has been removed.",
            variant: "destructive",
          });
          navigate('/marketplace');
          return;
        }

        // Type assertion and null check
        const productData = data as DatabaseProduct;
        
        // Set initial product data with required fields
        setProduct({
          ...productData,
          description: productData.description || '', // Handle null description
          seller: {
            id: productData.seller_id,
            full_name: "Loading...",
            avatar_url: "/placeholder.svg"
          }
        });

        // Then fetch seller profile in parallel with liked status
        const { data: { user } } = await supabase.auth.getUser();
        
        const [sellerResponse, likedResponse] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', productData.seller_id)
            .maybeSingle(),
          user ? supabase.rpc('check_product_liked', {
            check_user_id: user.id,
            check_product_id: id
          }) : Promise.resolve({ data: false })
        ]);

        // Update seller info if available
        if (sellerResponse.data) {
          setProduct(current => {
            if (!current) return null;
            return {
              ...current,
              seller: sellerResponse.data
            };
          });
        }

        // Update liked status
        setIsLiked(!!likedResponse.data);

        // Set up realtime subscription for product updates
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
            (payload: RealtimePostgresChangesPayload<DatabaseProduct>) => {
              console.log('Product updated:', payload);
              if (!payload.new) return;
              
              setProduct(current => {
                if (!current) return null;
                return {
                  ...current,
                  ...payload.new,
                  description: payload.new.description || '', // Handle null description
                  seller: current.seller
                };
              });
            }
          )
          .subscribe();

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

          <div className="space-y-6">
            <ProductHeader 
              product={{
                id: product.id,
                title: product.title,
                description: product.description
              }}
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
