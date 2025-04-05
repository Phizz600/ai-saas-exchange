
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Define the Supabase URL and key from environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, serviceRoleKey);

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting check for ended auctions...');

    // Find auctions that have ended but haven't been processed yet
    const now = new Date().toISOString();
    const { data: endedAuctions, error: fetchError } = await supabase
      .from('products')
      .select('id, title, auction_end_time, status, highest_bid, highest_bidder_id')
      .lt('auction_end_time', now)  // Auction end time is in the past
      .eq('status', 'active')       // Status is still active
      .is('auction_end_time', 'not.null');  // Only auctions

    if (fetchError) {
      console.error('Error fetching ended auctions:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${endedAuctions ? endedAuctions.length : 0} ended auctions to process`);

    if (!endedAuctions || endedAuctions.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No ended auctions to process' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Process each ended auction
    const results = await Promise.allSettled(
      endedAuctions.map(async (auction) => {
        console.log(`Processing ended auction: ${auction.id} - ${auction.title}`);
        
        // Call the send-auction-result-email function
        const emailResponse = await supabase.functions.invoke('send-auction-result-email', {
          body: { productId: auction.id }
        });

        if (emailResponse.error) {
          console.error(`Error sending auction result email for ${auction.id}:`, emailResponse.error);
          throw new Error(`Error sending auction result email: ${emailResponse.error}`);
        }

        console.log(`Successfully processed auction ${auction.id}`);
        return auction.id;
      })
    );

    // Count successes and failures
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // Log failures
    results
      .filter(r => r.status === 'rejected')
      .forEach(r => console.error('Failed auction processing:', (r as PromiseRejectedResult).reason));

    console.log(`Processed ${successful} auctions successfully, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${successful} auctions successfully, ${failed} failed`,
        processed: successful,
        failed: failed,
        total: endedAuctions.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in check-ended-auctions function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
