import { ProductCard } from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import { mockProducts } from "@/data/mockProducts";

interface RelatedProductsProps {
  currentProductCategory: string;
  currentProductId: string;
}

export const RelatedProducts = ({ currentProductCategory, currentProductId }: RelatedProductsProps) => {
  console.log('Analytics: Related products viewed for category:', currentProductCategory);
  
  const relatedProducts = mockProducts
    .filter(product => 
      product.category === currentProductCategory && 
      String(product.id) !== currentProductId
    )
    .slice(0, 2)
    .map(product => ({
      ...product,
      id: String(product.id),
      monthlyRevenue: product.monthly_revenue,
      image: product.image_url,
      timeLeft: "2 days left",
      seller: {
        id: String(product.seller_id),
        name: "AI Innovator",
        avatar: "/placeholder.svg",
        achievements: []
      }
    }));

  if (relatedProducts.length === 0) return null;

  return (
    <Card className="p-4 mt-4 bg-white/80 backdrop-blur-xl">
      <h3 className="text-lg font-semibold mb-4">Related Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Card>
  );
};