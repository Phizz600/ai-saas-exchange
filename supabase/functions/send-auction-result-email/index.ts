
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'npm:resend@2.0.0';

// Define the Supabase URL and key from environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';

// Create Resend client
const resend = new Resend(resendApiKey);

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, serviceRoleKey);

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Email templates for different scenarios
const getWinnerEmailTemplate = (product: any, bidAmount: number) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8B5CF6;">Congratulations! You've won an auction</h2>
      <p>You are the winning bidder for <strong>${product.title}</strong> with a bid of $${bidAmount.toLocaleString()}.</p>
      <p>The seller will be in touch with you soon to arrange the next steps. You can also start a conversation with the seller in your messages.</p>
      <div style="margin: 20px 0; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
        <p style="margin: 0;"><strong>Product:</strong> ${product.title}</p>
        <p style="margin: 5px 0;"><strong>Final Price:</strong> $${bidAmount.toLocaleString()}</p>
      </div>
      <p>Thank you for participating in our Dutch auction platform!</p>
      <a href="${supabaseUrl.replace('.supabase.co', '.vercel.app')}/messages" 
         style="display: inline-block; background-color: #8B5CF6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
        Go to Messages
      </a>
    </div>
  `;
};

const getSellerEmailTemplate = (product: any, bidAmount: number, winnerEmail: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8B5CF6;">Your auction has ended successfully!</h2>
      <p>Your auction for <strong>${product.title}</strong> has ended with a winning bid of $${bidAmount.toLocaleString()}.</p>
      <p>Please contact the buyer at <strong>${winnerEmail}</strong> to arrange the next steps. You can also use the messaging system on our platform.</p>
      <div style="margin: 20px 0; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
        <p style="margin: 0;"><strong>Product:</strong> ${product.title}</p>
        <p style="margin: 5px 0;"><strong>Final Price:</strong> $${bidAmount.toLocaleString()}</p>
        <p style="margin: 5px 0;"><strong>Buyer Email:</strong> ${winnerEmail}</p>
      </div>
      <a href="${supabaseUrl.replace('.supabase.co', '.vercel.app')}/messages" 
         style="display: inline-block; background-color: #8B5CF6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
        Go to Messages
      </a>
    </div>
  `;
};

const getNoWinnerEmailTemplate = (product: any) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8B5CF6;">Your auction has ended</h2>
      <p>Your auction for <strong>${product.title}</strong> has ended without any bids.</p>
      <p>You may want to consider relisting the product with a different starting price or as a fixed-price listing.</p>
      <div style="margin: 20px 0; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
        <p style="margin: 0;"><strong>Product:</strong> ${product.title}</p>
      </div>
      <a href="${supabaseUrl.replace('.supabase.co', '.vercel.app')}/product-dashboard" 
         style="display: inline-block; background-color: #8B5CF6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
        Go to Dashboard
      </a>
    </div>
  `;
};

// Handle requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if Resend API key is configured
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      throw new Error('RESEND_API_KEY is not configured');
    }

    // Get request body
    const { productId, mode } = await req.json();
    
    if (!productId) {
      throw new Error('Product ID is required');
    }

    console.log(`Processing auction result email for product ${productId}, mode: ${mode || 'auto'}`);

    // Get product details - Fixed the query syntax here
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*, seller:profiles!products_seller_id_fkey(email, full_name)')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      console.error('Error fetching product:', productError);
      throw new Error(`Product not found: ${productError?.message || 'Unknown error'}`);
    }

    // Check if product is an auction and has ended
    if (!product.auction_end_time) {
      throw new Error('Product is not an auction');
    }

    const now = new Date();
    const auctionEndTime = new Date(product.auction_end_time);
    
    // Only proceed if the auction has ended or we're in manual mode
    if (mode !== 'manual' && auctionEndTime > now) {
      console.log(`Auction has not ended yet, scheduled end time: ${auctionEndTime.toISOString()}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Auction has not ended yet',
          auctionEndTime: auctionEndTime.toISOString(),
          currentTime: now.toISOString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Get seller email
    const sellerEmail = product.seller?.email;
    if (!sellerEmail) {
      throw new Error('Seller email not found');
    }

    // Determine if there's a winner
    if (product.highest_bid && product.highest_bidder_id) {
      // There's a winner - get winner details
      const { data: winner, error: winnerError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', product.highest_bidder_id)
        .single();

      if (winnerError || !winner) {
        console.error('Error fetching winner:', winnerError);
        throw new Error(`Winner not found: ${winnerError?.message || 'Unknown error'}`);
      }

      const winnerEmail = winner.email;
      if (!winnerEmail) {
        throw new Error('Winner email not found');
      }

      console.log(`Sending winner email to ${winnerEmail} and seller email to ${sellerEmail}`);

      // Send email to winner using Resend
      const winnerResponse = await resend.emails.send({
        from: 'AI Exchange <notifications@ai-exchange.club>',
        to: [winnerEmail],
        subject: `Congratulations! You won the auction for ${product.title}`,
        html: getWinnerEmailTemplate(product, product.highest_bid)
      });

      if (!winnerResponse || winnerResponse.error) {
        console.error('Error sending winner email:', winnerResponse?.error);
        throw new Error(`Failed to send winner email: ${JSON.stringify(winnerResponse?.error)}`);
      }

      // Send email to seller
      const sellerResponse = await resend.emails.send({
        from: 'AI Exchange <notifications@ai-exchange.club>',
        to: [sellerEmail],
        subject: `Your auction for ${product.title} has ended successfully!`,
        html: getSellerEmailTemplate(product, product.highest_bid, winnerEmail)
      });

      if (!sellerResponse || sellerResponse.error) {
        console.error('Error sending seller email:', sellerResponse?.error);
        throw new Error(`Failed to send seller email: ${JSON.stringify(sellerResponse?.error)}`);
      }

      // Update product status if needed
      if (product.status !== 'ended') {
        const { error: updateError } = await supabase
          .from('products')
          .update({ status: 'ended' })
          .eq('id', productId);

        if (updateError) {
          console.error('Error updating product status:', updateError);
          // Continue despite error as emails were sent
        }
      }

      console.log('Successfully sent auction result emails for winner auction');
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Auction result emails sent successfully using Resend',
          winner: {
            email: winnerEmail,
            bid: product.highest_bid
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    } else {
      // No winner - notify seller only
      console.log(`No winner for auction ${productId}, sending no-winner email to ${sellerEmail}`);
      
      const response = await resend.emails.send({
        from: 'AI Exchange <notifications@ai-exchange.club>',
        to: [sellerEmail],
        subject: `Your auction for ${product.title} has ended`,
        html: getNoWinnerEmailTemplate(product)
      });

      if (!response || response.error) {
        console.error('Error sending no-winner email:', response?.error);
        throw new Error(`Failed to send no-winner email: ${JSON.stringify(response?.error)}`);
      }

      // Update product status if needed
      if (product.status !== 'ended') {
        const { error: updateError } = await supabase
          .from('products')
          .update({ status: 'ended' })
          .eq('id', productId);

        if (updateError) {
          console.error('Error updating product status:', updateError);
          // Continue despite error as email was sent
        }
      }

      console.log('Successfully sent no-winner auction result email');
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No-winner auction result email sent successfully using Resend'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
  } catch (error) {
    console.error('Error in send-auction-result-email function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
