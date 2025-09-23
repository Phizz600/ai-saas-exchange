-- First drop triggers that depend on auction functions
DROP TRIGGER IF EXISTS update_product_highest_bid ON bids;
DROP TRIGGER IF EXISTS record_bid_price ON bids;
DROP TRIGGER IF EXISTS validate_bid_amount_trigger ON bids;

-- Drop auction-related functions with CASCADE
DROP FUNCTION IF EXISTS public.update_highest_bid() CASCADE;
DROP FUNCTION IF EXISTS public.validate_bid_amount() CASCADE;
DROP FUNCTION IF EXISTS public.notify_new_bid() CASCADE;
DROP FUNCTION IF EXISTS public.create_conversation_on_auction_end() CASCADE;
DROP FUNCTION IF EXISTS public.record_bid_price() CASCADE;
DROP FUNCTION IF EXISTS public.update_dutch_auction_prices() CASCADE;
DROP FUNCTION IF EXISTS public.check_auctions_ending_soon() CASCADE;

-- Remove Dutch auction related columns from products table
ALTER TABLE public.products 
DROP COLUMN IF EXISTS auction_end_time,
DROP COLUMN IF EXISTS starting_price,
DROP COLUMN IF EXISTS current_price,
DROP COLUMN IF EXISTS min_price,
DROP COLUMN IF EXISTS price_decrement,
DROP COLUMN IF EXISTS price_decrement_interval,
DROP COLUMN IF EXISTS auction_status,
DROP COLUMN IF EXISTS no_reserve,
DROP COLUMN IF EXISTS reserve_price,
DROP COLUMN IF EXISTS highest_bid,
DROP COLUMN IF EXISTS highest_bidder_id;

-- Update listing_type to only allow fixed_price
ALTER TABLE public.products 
ALTER COLUMN listing_type SET DEFAULT 'fixed_price';

-- Update existing products to be fixed_price if they were dutch_auction
UPDATE public.products 
SET listing_type = 'fixed_price' 
WHERE listing_type = 'dutch_auction';