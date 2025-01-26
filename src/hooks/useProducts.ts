import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type Product = Database['public']['Tables']['products']['Row'];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  return { products, isLoading, setProducts };
};