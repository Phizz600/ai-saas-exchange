
import { supabase } from './client';

/**
 * Gets matched products for the current user
 * @returns Array of matched products
 */
export const getMatchedProducts = async () => {
  try {
    console.log("Fetching matched products for current user");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return [];
    }

    const { data, error } = await supabase
      .from('matched_products')
      .select('*')
      .eq('investor_id', user.id)
      .order('match_score', { ascending: false });

    if (error) {
      console.error('Error fetching matched products:', error);
      throw error;
    }

    console.log(`Retrieved ${data?.length || 0} matched products`);
    return data || [];
  } catch (error) {
    console.error('Error in getMatchedProducts:', error);
    return [];
  }
};

/**
 * Gets offers for the current user's products
 * @returns Array of offers
 */
export const getProductOffers = async () => {
  try {
    console.log("Fetching product offers for current user");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return [];
    }

    const { data: userProducts, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('seller_id', user.id);

    if (productError) {
      console.error('Error fetching user products:', productError);
      return [];
    }

    if (!userProducts?.length) {
      console.log('User has no products, returning empty offers array');
      return [];
    }

    const productIds = userProducts.map(product => product.id);
    console.log(`Found ${productIds.length} products for user`);

    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        products:product_id (
          title,
          image_url
        ),
        bidder:bidder_id (
          full_name,
          avatar_url
        )
      `)
      .in('product_id', productIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }

    console.log(`Retrieved ${data?.length || 0} offers for user's products`);
    return data || [];
  } catch (error) {
    console.error('Error in getProductOffers:', error);
    return [];
  }
};

/**
 * Updates the status of an offer
 * @param offerId The offer ID to update
 * @param status The new status (accepted or declined)
 * @returns The updated offer data
 */
export const updateOfferStatus = async (offerId: string, status: 'accepted' | 'declined') => {
  try {
    console.log(`Updating offer ${offerId} status to ${status}`);
    const { data, error } = await supabase
      .from('offers')
      .update({ status })
      .eq('id', offerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating offer status:', error);
      throw error;
    }

    console.log('Offer status updated successfully');
    return data;
  } catch (error) {
    console.error('Error in updateOfferStatus:', error);
    return null;
  }
};

/**
 * Logs an error to both console and Supabase (for monitoring)
 * @param source The source/component where the error occurred
 * @param error The error object or message
 * @param context Additional context data
 */
export const logError = async (source: string, error: any, context: Record<string, any> = {}) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  
  // Log to console
  console.error(`[${source}] Error:`, errorMessage);
  if (stack) console.error(stack);
  if (Object.keys(context).length) console.error('Context:', context);
  
  try {
    // Get current user for attribution if available
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    // Log to error_logs table
    await supabase
      .from('error_logs')
      .insert([{
        source,
        error_message: errorMessage,
        error_stack: stack,
        context_data: { ...context, userId },
        user_id: userId
      }]);
      
  } catch (logError) {
    // Fallback to console if logging to Supabase fails
    console.error('Failed to log error to database:', logError);
  }
  
  // Return the original error for chaining
  return error;
};
