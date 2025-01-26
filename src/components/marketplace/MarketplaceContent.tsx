import { useState, useEffect } from "react";
import { SearchFilters } from "@/components/marketplace/SearchFilters";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { MarketplacePagination } from "@/components/marketplace/MarketplacePagination";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { incrementProductViews } from "@/integrations/supabase/functions";
import { NotificationSheet } from "./notifications/NotificationSheet";
import { useNotifications } from "./notifications/useNotifications";

type Product = Database['public']['Tables']['products']['Row'];

export const MarketplaceContent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevant");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  // Fetch initial products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from Supabase');
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          throw error;
        }

        console.log('Products fetched successfully:', data);
        setProducts(data || []);
      } catch (error) {
        console.error('Error in fetchProducts:', error);
        toast({
          variant: "destructive",
          title: "Error loading products",
          description: "Failed to load marketplace products. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Subscribe to new products
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
            return [newProduct, ...prevProducts];
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

  // Track product views
  const trackProductView = async (productId: string) => {
    try {
      await incrementProductViews(productId);
      console.log('Product view tracked:', productId);
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };

  if (isLoading) {
    return (
      <ProductGrid products={[]} isLoading={true} />
    );
  }

  if (products.length === 0 && !isLoading) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Products Found</AlertTitle>
        <AlertDescription>
          There are currently no products listed in the marketplace. Be the first to list your AI product!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
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

        <NotificationSheet 
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
        />
      </div>

      <ProductGrid 
        products={products} 
        isLoading={isLoading} 
        onProductView={trackProductView}
      />

      {!isLoading && products.length > 0 && (
        <MarketplacePagination
          currentPage={currentPage}
          totalPages={Math.ceil(products.length / 6)}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
};