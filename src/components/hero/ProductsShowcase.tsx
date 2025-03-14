
import { ProductCard } from "./product-showcase/ProductCard";
import { placeholderProducts } from "./product-showcase/placeholderProducts";

interface ProductsShowcaseProps {
  isAuthenticated: boolean;
  handleAuthRedirect: () => void;
}

export const ProductsShowcase = ({ 
  isAuthenticated, 
  handleAuthRedirect 
}: ProductsShowcaseProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {placeholderProducts.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          isAuthenticated={isAuthenticated}
          handleAuthRedirect={handleAuthRedirect}
        />
      ))}
    </div>
  );
};
