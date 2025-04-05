
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
      .select('id, price_decrement, price_decrement_interval, current_price, min_price, auction_end_time, highest_bid')
      .gte('auction_end_time', new Date().toISOString())
      .lt('current_price', 'starting_price')
      .gt('current_price', 'min_price')
      .is('price_decrement', 'not.null');

    if (fetchError) {
      console.error('Error fetching auctions:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${auctions ? auctions.length : 0} active auctions`);

    // Process each auction
    const updates = [];
    for (const auction of auctions || []) {
      // Calculate appropriate decrement based on interval
      const currentTime = new Date();
      const lastUpdate = new Date(auction.updated_at || currentTime);
      let shouldUpdate = false;
      let decrementAmount = 0;

      switch (auction.price_decrement_interval) {
        case 'minute':
          // Calculate minutes elapsed since last update
          const minutesElapsed = Math.floor((currentTime.getTime() - lastUpdate.getTime()) / (60 * 1000));
          if (minutesElapsed >= 1) {
            decrementAmount = auction.price_decrement * minutesElapsed;
            shouldUpdate = true;
          }
          break;
        case 'hour':
          const hoursElapsed = Math.floor((currentTime.getTime() - lastUpdate.getTime()) / (60 * 60 * 1000));
          if (hoursElapsed >= 1) {
            decrementAmount = auction.price_decrement * hoursElapsed;
            shouldUpdate = true;
          }
          break;
        case 'day':
          const daysElapsed = Math.floor((currentTime.getTime() - lastUpdate.getTime()) / (24 * 60 * 60 * 1000));
          if (daysElapsed >= 1) {
            decrementAmount = auction.price_decrement * daysElapsed;
            shouldUpdate = true;
          }
          break;
        case 'week':
          const weeksElapsed = Math.floor((currentTime.getTime() - lastUpdate.getTime()) / (7 * 24 * 60 * 60 * 1000));
          if (weeksElapsed >= 1) {
            decrementAmount = auction.price_decrement * weeksElapsed;
            shouldUpdate = true;
          }
          break;
        case 'month':
          // Approximate a month as 30 days
          const monthsElapsed = Math.floor((currentTime.getTime() - lastUpdate.getTime()) / (30 * 24 * 60 * 60 * 1000));
          if (monthsElapsed >= 1) {
            decrementAmount = auction.price_decrement * monthsElapsed;
            shouldUpdate = true;
          }
          break;
        default:
          console.log(`Unknown interval: ${auction.price_decrement_interval} for auction ${auction.id}`);
      }

      if (shouldUpdate) {
        // Calculate new price (don't go below min_price)
        let newPrice = Math.max(auction.current_price - decrementAmount, auction.min_price);
        
        // IMPORTANT: If there's a highest bid, make sure the price doesn't go below it
        // The highest bid should always take precedence in setting the current price
        if (auction.highest_bid) {
          newPrice = Math.max(newPrice, auction.highest_bid);
          console.log(`Auction ${auction.id} has highest bid of ${auction.highest_bid}, ensuring price doesn't go below it`);
        }
        
        if (newPrice < auction.current_price) {
          console.log(`Updating auction ${auction.id}: ${auction.current_price} -> ${newPrice}`);
          updates.push({
            id: auction.id,
            current_price: newPrice,
            updated_at: new Date().toISOString()
          });
        }
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
