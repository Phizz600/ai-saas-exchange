
-- Fix the min_price/reserve_price issue in the products table

-- Ensure we handle the transition from min_price to reserve_price with fallbacks
DO $$
BEGIN
    -- If min_price exists but reserve_price doesn't, rename min_price to reserve_price
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'min_price'
    ) AND NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'reserve_price'
    ) THEN
        ALTER TABLE products RENAME COLUMN min_price TO reserve_price;
        RAISE NOTICE 'Renamed min_price column to reserve_price';
    -- If both columns exist, copy data from min_price to reserve_price and drop min_price
    ELSIF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'min_price'
    ) AND EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'reserve_price'
    ) THEN
        -- Update reserve_price with min_price values where reserve_price is NULL
        UPDATE products
        SET reserve_price = min_price
        WHERE min_price IS NOT NULL AND reserve_price IS NULL;
        
        -- Drop the min_price column as it's no longer needed
        ALTER TABLE products DROP COLUMN min_price;
        RAISE NOTICE 'Copied data from min_price to reserve_price and dropped min_price column';
    -- If neither column exists, create reserve_price
    ELSIF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'reserve_price'
    ) AND NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'min_price'
    ) THEN
        ALTER TABLE products ADD COLUMN reserve_price NUMERIC;
        RAISE NOTICE 'Added reserve_price column to products table';
    END IF;
    
    -- Make sure the schema comment exists on reserve_price column
    COMMENT ON COLUMN products.reserve_price IS 'The minimum acceptable price for an auction';
END$$;

-- Force a refresh of the schema cache by creating and dropping a dummy table
CREATE TABLE _dummy_refresh_schema_cache (id serial);
DROP TABLE _dummy_refresh_schema_cache;
