
import { supabase } from './client';

/**
 * Gets matched products for the current user
 * @returns Array of matched products
 */
export const getMatchedProducts = async () => {
  try {
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return [];
    }

    const { data: userProducts } = await supabase
      .from('products')
      .select('id')
      .eq('seller_id', user.id);

    if (!userProducts?.length) {
      return [];
    }

    const productIds = userProducts.map(product => product.id);

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

    return data;
  } catch (error) {
    console.error('Error in updateOfferStatus:', error);
    return null;
  }
};
