import { ProductCard } from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import { mockProducts } from "@/data/mockProducts";

interface RelatedProductsProps {
  currentProductCategory: string;
  currentProductId: string;  // Changed from number to string
}

export const RelatedProducts = ({ currentProductCategory, currentProductId }: RelatedProductsProps) => {
  console.log('Analytics: Related products viewed for category:', currentProductCategory);
  
  const relatedProducts = mockProducts
    .filter(product => 
      product.category === currentProductCategory && 
      String(product.id) !== currentProductId  // Convert number to string for comparison
    )
    .slice(0, 2);

  if (relatedProducts.length === 0) return null;

  return (
    <Card className="p-4 mt-4 bg-white/80 backdrop-blur-xl">
      <h3 className="text-lg font-semibold mb-4">Related Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {relatedProducts.map((product) => (
          <ProductCard 
            key={String(product.id)} 
            product={{
              ...product,
              id: String(product.id),
              seller: {
                ...product.seller,
                id: String(product.seller.id)
              }
            }} 
          />
        ))}
      </div>
    </Card>
  );
};