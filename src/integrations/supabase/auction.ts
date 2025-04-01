
import { supabase } from './client';

/**
 * Calculates the current price of a Dutch auction based on the auction parameters
 * @param startingPrice The initial auction price
 * @param minPrice The minimum auction price
 * @param priceDecrement How much the price decreases per interval
 * @param priceDecrementInterval The interval for price decreases (minute, hour, day, etc.)
 * @param auctionStartTime When the auction started
 * @param currentTime Current time (defaults to now)
 * @returns The calculated current price
 */
export const calculateCurrentAuctionPrice = (
  startingPrice: number,
  minPrice: number,
  priceDecrement: number,
  priceDecrementInterval: string,
  auctionStartTime: string,
  currentTime: Date = new Date()
): number => {
  const start = new Date(auctionStartTime);
  const timeDiffMs = currentTime.getTime() - start.getTime();
  
  let decrementCount = 0;
  
  // Calculate how many intervals have passed
  switch (priceDecrementInterval) {
    case 'minute':
      decrementCount = Math.floor(timeDiffMs / (60 * 1000));
      break;
    case 'hour':
      decrementCount = Math.floor(timeDiffMs / (60 * 60 * 1000));
      break;
    case 'day':
      decrementCount = Math.floor(timeDiffMs / (24 * 60 * 60 * 1000));
      break;
    case 'week':
      decrementCount = Math.floor(timeDiffMs / (7 * 24 * 60 * 60 * 1000));
      break;
    case 'month':
      // Approximate a month as 30 days
      decrementCount = Math.floor(timeDiffMs / (30 * 24 * 60 * 60 * 1000));
      break;
  }
  
  // Calculate current price
  const totalDecrement = decrementCount * priceDecrement;
  const calculatedPrice = startingPrice - totalDecrement;
  
  // Don't go below minimum price
  return Math.max(calculatedPrice, minPrice);
};

/**
 * Places a bid on a product 
 * @param productId ID of the product to bid on
 * @param amount Bid amount
 * @returns The created bid if successful
 */
export const placeBid = async (productId: string, amount: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if product exists and is an active auction
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError) {
      throw new Error('Product not found');
    }

    if (!product.auction_end_time) {
      throw new Error('This is not an auction product');
    }

    if (new Date(product.auction_end_time) < new Date()) {
      throw new Error('This auction has ended');
    }

    // Place the bid
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .insert({
        product_id: productId,
        bidder_id: user.id,
        amount: amount,
        status: 'pending'
      })
      .select()
      .single();

    if (bidError) {
      if (bidError.message.includes('higher than current')) {
        throw new Error('Your bid must be higher than the current highest bid');
      }
      throw new Error(`Error placing bid: ${bidError.message}`);
    }

    return bid;
  } catch (error) {
    console.error('Error in placeBid:', error);
    throw error;
  }
};
