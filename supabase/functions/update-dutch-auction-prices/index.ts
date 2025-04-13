
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
    console.log('Starting Dutch auction price update...');

    // Get all active Dutch auctions
    const { data: auctions, error: fetchError } = await supabase
      .from('products')
      .select('id, price_decrement, price_decrement_interval, current_price, reserve_price, starting_price, auction_end_time, highest_bid, created_at, updated_at')
      .gte('auction_end_time', new Date().toISOString())
      .is('price_decrement', 'not.null');

    if (fetchError) {
      console.error('Error fetching auctions:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${auctions ? auctions.length : 0} active auctions`);

    // Process each auction
    const updates = [];
    for (const auction of auctions || []) {
      // Skip auctions that already have a highest bid
      if (auction.highest_bid) {
        console.log(`Auction ${auction.id} has highest bid of ${auction.highest_bid}, skipping automated price decrease`);
        continue;
      }
      
      // Calculate appropriate decrement based on interval
      const currentTime = new Date();
      const lastUpdate = new Date(auction.updated_at || auction.created_at);
      const startTime = new Date(auction.created_at);
      let shouldUpdate = false;
      
      // Calculate how many intervals have passed since the auction started
      const timeSinceStart = currentTime.getTime() - startTime.getTime();
      let decrementCount = 0;
      
      switch (auction.price_decrement_interval) {
        case 'minute':
          decrementCount = Math.floor(timeSinceStart / (60 * 1000));
          break;
        case 'hour':
          decrementCount = Math.floor(timeSinceStart / (60 * 60 * 1000));
          break;
        case 'day':
          decrementCount = Math.floor(timeSinceStart / (24 * 60 * 60 * 1000));
          break;
        case 'week':
          decrementCount = Math.floor(timeSinceStart / (7 * 24 * 60 * 60 * 1000));
          break;
        case 'month':
          // Approximate a month as 30 days
          decrementCount = Math.floor(timeSinceStart / (30 * 24 * 60 * 60 * 1000));
          break;
        default:
          console.log(`Unknown interval: ${auction.price_decrement_interval} for auction ${auction.id}`);
          continue; // Skip this auction
      }

      // Calculate the expected price based on decrementCount
      const totalDecrement = decrementCount * (auction.price_decrement || 0);
      const expectedPrice = Math.max(
        auction.starting_price - totalDecrement, 
        auction.reserve_price || 0
      );
      
      // Only update if the current price is different from the expected price
      if (Math.abs(auction.current_price - expectedPrice) > 0.01) {
        console.log(`Updating auction ${auction.id}: current=${auction.current_price}, expected=${expectedPrice}, intervals=${decrementCount}`);
        updates.push({
          id: auction.id,
          current_price: expectedPrice,
          updated_at: new Date().toISOString()
        });
        shouldUpdate = true;
      } else {
        console.log(`Auction ${auction.id} price is already correct (${auction.current_price})`);
      }
    }

    // Update prices if needed
    if (updates.length > 0) {
      const { data, error } = await supabase
        .from('products')
        .upsert(updates)
        .select();

      if (error) {
        console.error('Error updating prices:', error);
        throw error;
      }

      console.log(`Successfully updated ${data?.length || 0} auctions`);
    } else {
      console.log('No auctions needed updates');
    }

    return new Response(
      JSON.stringify({ success: true, updated: updates.length }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in update-dutch-auction-prices function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
