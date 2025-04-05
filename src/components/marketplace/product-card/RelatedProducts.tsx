
import { ProductCard } from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedProductsProps {
  currentProductCategory: string;
  currentProductId: string;
}

export const RelatedProducts = ({ currentProductCategory, currentProductId }: RelatedProductsProps) => {
  const { data: relatedProducts = [], isLoading } = useQuery({
    queryKey: ['relatedProducts', currentProductCategory, currentProductId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:profiles (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .eq('category', currentProductCategory)
        .neq('id', currentProductId)
        .limit(9); // Increased to max 9 products

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <Card className="p-4 mt-4 bg-white/80 backdrop-blur-xl">
        <h3 className="text-lg font-semibold mb-4 exo-2-heading">Related Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-[350px] w-full rounded-md" />
          ))}
        </div>
      </Card>
    );
  }

  if (relatedProducts.length === 0) return null;

  return (
    <Card className="p-4 mt-4 bg-white/80 backdrop-blur-xl">
      <h3 className="text-lg font-semibold mb-4 exo-2-heading">Related Products</h3>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {relatedProducts.map((product) => (
            <CarouselItem 
              key={product.id} 
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <ProductCard
                product={{
                  id: product.id,
                  title: product.title,
                  description: product.description || "",
                  price: Number(product.price),
                  category: product.category,
                  stage: product.stage,
                  monthlyRevenue: Number(product.monthly_revenue || 0),
                  image: product.image_url || "/placeholder.svg",
                  auction_end_time: product.auction_end_time,
                  current_price: product.current_price,
                  min_price: product.min_price,
                  price_decrement: product.price_decrement,
                  seller: {
                    id: product.seller?.id || "",
                    name: product.seller?.full_name || "Anonymous",
                    avatar: product.seller?.avatar_url || "/placeholder.svg",
                    achievements: []
                  }
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-4 mr-2">
          <CarouselPrevious className="relative static left-0 right-auto translate-y-0 h-8 w-8" />
          <CarouselNext className="relative static right-0 left-auto translate-y-0 h-8 w-8" />
        </div>
      </Carousel>
    </Card>
  );
};
