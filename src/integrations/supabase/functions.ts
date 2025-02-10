
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

export const incrementProductClicks = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from('product_analytics')
      .upsert(
        {
          product_id: productId,
          date: new Date().toISOString().split('T')[0],
          clicks: 1
        },
        {
          onConflict: 'product_id,date',
          ignoreDuplicates: false
        }
      )
      .select('clicks')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error incrementing product clicks:', error);
    throw error;
  }
};

export const getProductAnalytics = async (productId: string) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { data, error } = await supabase
      .from('product_analytics')
      .select('views, clicks, saves')
      .eq('product_id', productId)
      .gte('date', yesterday.toISOString())
      .maybeSingle();

    if (error) throw error;
    return data || { views: 0, clicks: 0, saves: 0 };
  } catch (error) {
    console.error('Error fetching product analytics:', error);
    throw error;
  }
};
