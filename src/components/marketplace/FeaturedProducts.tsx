import { ProductCard } from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import { mockProducts } from "@/data/mockProducts";
import { useEffect } from "react";

export const FeaturedProducts = () => {
  useEffect(() => {
    console.log('Analytics: Featured products section viewed');
  }, []);

  const featuredProducts = mockProducts
    .filter(product => product.monthly_revenue > 5000)
    .sort((a, b) => b.monthly_revenue - a.monthly_revenue)
    .slice(0, 3)
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

  if (featuredProducts.length === 0) return null;

  return (
    <Card className="p-4 mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-xl border-primary/10">
      <h2 className="text-xl font-semibold mb-4 text-accent">Trending Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Card>
  );
};