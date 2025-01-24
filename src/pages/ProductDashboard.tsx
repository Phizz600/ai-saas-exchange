import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductDashboardLayout } from "@/components/product-dashboard/ProductDashboardLayout";

export const ProductDashboard = () => {
  console.log('ProductDashboard page component rendered');
  return <ProductDashboardLayout />;
};