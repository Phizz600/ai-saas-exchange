
-- This migration fixes any Dutch auctions where the current price might have been decremented too quickly
-- For each auction, we'll reset the current price based on the starting price, min price, and when it was created

DO $$
DECLARE
    auction RECORD;
    elapsed_time INTERVAL;
    new_price NUMERIC;
    decrement_count INTEGER;
    interval_duration INTERVAL;
BEGIN
    -- Log that we're starting the fix
    RAISE NOTICE 'Starting Dutch auction data fix';
    
    -- Loop through all active Dutch auctions
    FOR auction IN 
        SELECT 
            id, 
            starting_price, 
            current_price, 
            min_price, 
            price_decrement, 
            price_decrement_interval, 
            created_at,
            auction_end_time
        FROM 
            products
        WHERE 
            auction_end_time IS NOT NULL
            AND price_decrement IS NOT NULL
            AND auction_end_time > NOW()
    LOOP
        -- Calculate how much time has passed since auction creation
        elapsed_time := NOW() - auction.created_at;
        
        -- Determine the interval duration in seconds
        CASE auction.price_decrement_interval
            WHEN 'minute' THEN interval_duration := INTERVAL '1 minute';
            WHEN 'hour' THEN interval_duration := INTERVAL '1 hour';
            WHEN 'day' THEN interval_duration := INTERVAL '1 day';
            WHEN 'week' THEN interval_duration := INTERVAL '1 week';
            WHEN 'month' THEN interval_duration := INTERVAL '30 days'; -- Approximate
            ELSE interval_duration := INTERVAL '1 hour'; -- Default
        END CASE;
        
        -- Calculate how many intervals have passed
        decrement_count := EXTRACT(EPOCH FROM elapsed_time) / EXTRACT(EPOCH FROM interval_duration);
        
        -- Calculate the correct current price
        new_price := GREATEST(
            auction.min_price,
            auction.starting_price - (auction.price_decrement * decrement_count)
        );
        
        -- Update the auction with the corrected price
        UPDATE products
        SET current_price = new_price
        WHERE id = auction.id;
        
        -- Log what we're doing
        RAISE NOTICE 'Fixed auction %: % -> % (decrement: %, intervals: %)', 
            auction.id, 
            auction.current_price, 
            new_price,
            auction.price_decrement,
            decrement_count;
    END LOOP;
    
    RAISE NOTICE 'Dutch auction data fix complete';
END $$;

-- Add a comment to the migration to explain what it does
COMMENT ON SCHEMA public IS 'This migration fixes Dutch auction prices that may have been incorrectly decremented too quickly due to not respecting the price_decrement_interval setting.';
