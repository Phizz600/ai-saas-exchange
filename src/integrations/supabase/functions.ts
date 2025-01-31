import { supabase } from './client';

export const incrementProductViews = async (productId: string) => {
  try {
    console.log('Incrementing views for product:', productId);
    const { data, error } = await supabase.rpc('increment_product_views', {
      input_product_id: productId
    });
    
    if (error) {
      console.error('Error incrementing product views:', error);
      throw error;
    }
    
    console.log('Successfully incremented product views:', data);
    return data;
  } catch (error) {
    console.error('Failed to increment product views:', error);
    throw error;
  }
};