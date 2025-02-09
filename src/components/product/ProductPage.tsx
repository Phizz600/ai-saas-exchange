
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

export function ProductPage() {
  const { id } = useParams();
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

        const { data: product, error } = await supabase
          .from('products')
          .select(`
            *,
            seller:profiles (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching product:', error);
          throw error;
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

        console.log('Fetched product:', product);
        setProduct(product);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('liked_products')
            .eq('id', user.id)
            .maybeSingle();
          
          if (profile?.liked_products) {
            setIsLiked(profile.liked_products.includes(id));
          }
        }
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
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
            <PriceHistoryChart productId={product.id} />
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
