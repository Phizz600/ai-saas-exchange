
-- Update the dutch auction function to respect the highest bid and use reserve_price instead of min_price
CREATE OR REPLACE FUNCTION public.update_dutch_auction_prices()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Only decrease the price if there's no highest bid or if the calculated price would still be higher than the highest bid
  UPDATE products
  SET current_price = 
    CASE 
      -- If there's a highest bid, use it as the reserve price minimum
      WHEN highest_bid IS NOT NULL THEN 
        GREATEST(
          reserve_price,  -- Using reserve_price instead of min_price
          highest_bid,
          GREATEST(
            reserve_price,  -- Using reserve_price instead of min_price
            current_price - COALESCE(price_decrement, 0)
          )
        )
      -- Otherwise, just decrease the price as normal
      ELSE
        GREATEST(
          reserve_price,  -- Using reserve_price instead of min_price
          current_price - COALESCE(price_decrement, 0)
        )
    END
  WHERE 
    auction_end_time > NOW()
    AND current_price > reserve_price  -- Using reserve_price instead of min_price
    AND price_decrement IS NOT NULL;
END;
$function$;
