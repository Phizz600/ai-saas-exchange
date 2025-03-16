import { supabase } from './client';

const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

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

/**
 * Sends an email using Brevo through the Supabase edge function
 * @param event The event triggering the email
 * @param recipient The email recipient
 * @param templateId Optional Brevo template ID (if not provided, will use mapping based on event)
 * @param params Optional parameters to be used in the email template
 */
export const sendBrevoEmail = async (
  event: 'user_signup' | 'product_listed' | 'offer_received' | 'pitch_deck_generated' | string,
  recipient: string,
  templateId?: number,
  params?: Record<string, any>
) => {
  try {
    if (!recipient || !recipient.includes('@')) {
      console.error('Invalid email recipient:', recipient);
      return { success: false, error: 'Invalid email recipient' };
    }

    console.log(`Sending ${event} email to ${recipient}`);
    const { data, error } = await supabase.functions.invoke('send-brevo-email', {
      body: {
        event,
        recipient,
        templateId,
        params
      }
    });

    if (error) {
      console.error('Error calling send-brevo-email function:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in sendBrevoEmail:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate a pitch deck using OpenAI
 */
export const generatePitchDeck = async (
  title: string,
  description: string,
  category: string,
  stage: string,
  monthlyRevenue?: number
) => {
  try {
    console.log('Requesting pitch deck generation for:', title);
    const { data, error } = await supabase.functions.invoke('generate-pitch-deck', {
      body: {
        title,
        description,
        category,
        stage,
        monthlyRevenue
      }
    });

    if (error) {
      console.error('Error calling generate-pitch-deck function:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Pitch deck generated successfully');
    
    // Optionally send an email notification about the generated pitch deck
    const user = await supabase.auth.getUser();
    if (user.data?.user?.email) {
      await sendBrevoEmail(
        'pitch_deck_generated',
        user.data.user.email,
        undefined,
        { 
          productTitle: title,
          userFirstName: user.data.user.user_metadata?.first_name || 'there'
        }
      );
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in generatePitchDeck:', error);
    return { success: false, error: error.message };
  }
};
