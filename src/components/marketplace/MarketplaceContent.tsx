import { useState, useEffect } from "react";
import { SearchFilters } from "@/components/marketplace/SearchFilters";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { MarketplacePagination } from "@/components/marketplace/MarketplacePagination";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { mockProducts } from "@/data/mockProducts";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Product = Database['public']['Tables']['products']['Row'];

export const MarketplaceContent = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevant");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up real-time subscription for products');
    const channel = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('New product received:', payload);
          const newProduct = payload.new as Product;
          
          setProducts(prevProducts => {
            console.log('Adding new product to state:', newProduct);
            return [...prevProducts, newProduct];
          });
          
          toast({
            title: "New Product Listed",
            description: `${newProduct.title} has been added to the marketplace`,
          });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Transform data to include all required fields
  const currentItems = products.map(product => ({
    ...product,
    id: String(product.id),
    monthly_revenue: product.monthly_revenue || 0,
    monthly_traffic: product.monthly_traffic || 0,
    image_url: product.image_url || "/placeholder.svg",
  }));
  
  const totalPages = 1;
  const isLoading = false;
  const error = null;

  if (error) {
    console.error('MarketplaceContent error:', error);
    toast({
      variant: "destructive",
      title: "Error loading products",
      description: "Please try again later.",
    });

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          There was an error loading the marketplace products. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        industryFilter={industryFilter}
        setIndustryFilter={setIndustryFilter}
        stageFilter={stageFilter}
        setStageFilter={setStageFilter}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        isLoading={isLoading}
      />

      <ProductGrid products={currentItems} isLoading={isLoading} />

      {!isLoading && currentItems.length > 0 && (
        <MarketplacePagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
};