
import { supabase } from "./client";

/**
 * Send an escrow action reminder
 */
export const sendEscrowReminder = async (
  conversationId: string,
  transactionId: string,
  userRole: "buyer" | "seller",
  status: string,
  hoursRemaining: number
) => {
  try {
    const { data, error } = await supabase.functions.invoke("send-escrow-reminder", {
      body: {
        conversationId,
        transactionId,
        userRole,
        status,
        hoursRemaining
      }
    });

    if (error) {
      console.error("Error sending escrow reminder:", error);
      return false;
    }

    return data.success;
  } catch (error) {
    console.error("Error in sendEscrowReminder:", error);
    return false;
  }
};

/**
 * Send auction result email notification
 */
export const sendAuctionResultEmail = async (productId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke("send-auction-result", {
      body: {
        productId
      }
    });

    if (error) {
      console.error("Error sending auction result email:", error);
      throw new Error("Failed to send auction result email");
    }

    return data;
  } catch (error) {
    console.error("Error in sendAuctionResultEmail:", error);
    throw error;
  }
};

/**
 * Check and update escrow transaction status
 */
export const updateEscrowLifecycle = async (
  transactionId: string,
  newStatus: string,
  message?: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke("escrow-api", {
      body: {
        action: "lifecycle_update",
        data: {
          transaction_id: transactionId,
          new_status: newStatus,
          message
        }
      }
    });

    if (error) {
      console.error("Error updating transaction lifecycle:", error);
      throw new Error("Failed to update transaction status");
    }

    return data;
  } catch (error) {
    console.error("Error in updateEscrowLifecycle:", error);
    throw error;
  }
};

/**
 * Send a test email
 */
export const sendTestEmail = async () => {
  try {
    const { data, error } = await supabase.functions.invoke("send-test-email", {
      body: {}
    });

    if (error) {
      console.error("Error sending test email:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in sendTestEmail:", error);
    throw error;
  }
};

/**
 * Send listing notification email
 */
export const sendListingNotification = async (
  type: 'submitted' | 'approved' | 'rejected',
  userEmail: string,
  productTitle: string,
  firstName: string,
  feedback?: string,
  productId?: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke("send-listing-notification", {
      body: {
        type,
        userEmail,
        productTitle,
        firstName,
        feedback,
        productId
      }
    });

    if (error) {
      console.error("Error sending listing notification:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in sendListingNotification:", error);
    throw error;
  }
};

/**
 * Check and process ended auctions
 */
export const checkEndedAuctions = async () => {
  try {
    const { data, error } = await supabase.functions.invoke("check-ended-auctions", {
      body: {}
    });

    if (error) {
      console.error("Error checking ended auctions:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in checkEndedAuctions:", error);
    throw error;
  }
};

/**
 * Increment product views in analytics
 */
export const incrementProductViews = async (productId: string) => {
  try {
    const { data, error } = await supabase.rpc('increment_product_views', {
      input_product_id: productId
    });

    if (error) {
      console.error("Error incrementing product views:", error);
      return null;
    }

    return { success: true };
  } catch (error) {
    console.error("Error in incrementProductViews:", error);
    return null;
  }
};

/**
 * Get product analytics data
 */
export const getProductAnalytics = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from('product_analytics')
      .select('views, clicks, saves')
      .eq('product_id', productId)
      .eq('date', new Date().toISOString().split('T')[0])
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error("Error fetching product analytics:", error);
      return { views: 0, clicks: 0, saves: 0 };
    }

    return data || { views: 0, clicks: 0, saves: 0 };
  } catch (error) {
    console.error("Error in getProductAnalytics:", error);
    return { views: 0, clicks: 0, saves: 0 };
  }
};

/**
 * Get matched products for investor
 */
export const getMatchedProducts = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('matched_products')
      .select('*')
      .eq('investor_id', user.id)
      .order('match_score', { ascending: false });

    if (error) {
      console.error("Error fetching matched products:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getMatchedProducts:", error);
    return [];
  }
};

/**
 * Get product offers for seller
 */
export const getProductOffers = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    const { data: products } = await supabase
      .from('products')
      .select('id')
      .eq('seller_id', user.id);

    if (!products || products.length === 0) {
      return [];
    }

    const productIds = products.map(p => p.id);

    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        products:product_id(
          title,
          image_url
        ),
        bidder:bidder_id(
          full_name,
          avatar_url
        )
      `)
      .in('product_id', productIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching product offers:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getProductOffers:", error);
    return [];
  }
};

/**
 * Update offer status
 */
export const updateOfferStatus = async (offerId: string, status: 'accepted' | 'declined') => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .update({ status })
      .eq('id', offerId)
      .select();

    if (error) {
      console.error("Error updating offer status:", error);
      throw new Error("Failed to update offer status");
    }

    return data;
  } catch (error) {
    console.error("Error in updateOfferStatus:", error);
    throw error;
  }
};
