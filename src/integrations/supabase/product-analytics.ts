
import { supabase } from './client';
import { isValidUUID } from './utils/validation';

/**
 * Increments the view count for a product (impressions when seen on marketplace)
 * @param productId The product ID to increment views for
 * @returns The updated view count data
 */
export const incrementProductViews = async (productId: string) => {
  try {
    if (!isValidUUID(productId)) {
      console.error('Invalid product ID format:', productId);
      return null;
    }

    console.log('Incrementing views for product:', productId);
    const { data, error } = await supabase
      .from('product_analytics')
      .upsert(
        {
          product_id: productId,
          date: new Date().toISOString().split('T')[0],
          views: 1
        },
        {
          onConflict: 'product_id,date',
          ignoreDuplicates: false
        }
      )
      .select('views')
      .maybeSingle();

    if (error) {
      console.error('Error incrementing product views:', error);
      throw error;
    }
    
    console.log('Successfully incremented product views:', data);
    return data;
  } catch (error) {
    console.error('Failed to increment product views:', error);
    return null;
  }
};

/**
 * Increments the click count for a product (when card is clicked to navigate to product page)
 * @param productId The product ID to increment clicks for
 * @returns The updated click count data
 */
export const incrementProductClicks = async (productId: string) => {
  try {
    if (!isValidUUID(productId)) {
      console.error('Invalid product ID format:', productId);
      return null;
    }

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
      .maybeSingle();

    if (error) {
      console.error('Error incrementing product clicks:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error incrementing product clicks:', error);
    return null;
  }
};

/**
 * Gets analytics data for a product
 * @param productId The product ID to get analytics for
 * @returns Object containing views, clicks, and saves counts
 */
export const getProductAnalytics = async (productId: string) => {
  try {
    if (!isValidUUID(productId)) {
      console.error('Invalid product ID format:', productId);
      return { views: 0, clicks: 0, saves: 0 };
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { data, error } = await supabase
      .from('product_analytics')
      .select('views, clicks, saves')
      .eq('product_id', productId)
      .gte('date', yesterday.toISOString().split('T')[0])
      .maybeSingle();

    if (error) {
      console.error('Error fetching product analytics:', error);
      return { views: 0, clicks: 0, saves: 0 };
    }
    
    return data || { views: 0, clicks: 0, saves: 0 };
  } catch (error) {
    console.error('Error fetching product analytics:', error);
    return { views: 0, clicks: 0, saves: 0 };
  }
};
