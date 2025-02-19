
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
  seller: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      console.log('Fetching product with ID:', id);
      
      if (!id) {
        throw new Error('No product ID provided');
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            seller:profiles!products_seller_id_fkey (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq('id', id)
          .maybeSingle();

        console.log('Supabase response:', { data, error });

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('Product not found');
        }

        return data as Product;
      } catch (error) {
        console.error('Error in queryFn:', error);
        throw error;
      }
    },
    retry: 1
  });

  useEffect(() => {
    if (error) {
      console.error('Query error:', error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
      navigate('/marketplace');
    }
  }, [error, toast, navigate]);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!id) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: likedStatus } = await supabase.rpc('check_product_liked', {
        check_user_id: user.id,
        check_product_id: id
      });
      setIsLiked(!!likedStatus);
    };

    checkIfLiked();
  }, [id]);

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
                description: product.description || ''
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
