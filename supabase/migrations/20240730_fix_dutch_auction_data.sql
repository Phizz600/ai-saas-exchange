
-- Add no_reserve field to products table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'no_reserve'
    ) THEN
        ALTER TABLE products ADD COLUMN no_reserve BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Rename min_price to reserve_price if it hasn't been done already
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'min_price'
    ) AND NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'reserve_price'
    ) THEN
        ALTER TABLE products RENAME COLUMN min_price TO reserve_price;
    END IF;
END$$;

-- Update auction products with current prices to ensure they're correct
UPDATE products
SET current_price = COALESCE(highest_bid, starting_price)
WHERE is_auction = TRUE 
AND auction_end_time > NOW()
AND current_price IS NULL;

-- Make sure any products with NULL reserve_price but starting_price have a proper reserve_price
UPDATE products
SET reserve_price = starting_price * 0.6
WHERE is_auction = TRUE
AND reserve_price IS NULL
AND starting_price IS NOT NULL;

COMMENT ON COLUMN products.reserve_price IS 'The minimum acceptable price for an auction (renamed from min_price)';
COMMENT ON COLUMN products.no_reserve IS 'Whether this is a no-reserve auction (sells at any price)';
