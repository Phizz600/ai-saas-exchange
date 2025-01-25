import { supabase } from "./client";

export const incrementProductViews = async (productId: string) => {
  const { data, error } = await supabase
    .rpc('increment_product_views', {
      product_id: productId
    });
  
  if (error) throw error;
  return data;
};