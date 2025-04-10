
-- Update the dutch auction function to ensure correct terminology
-- Note: We keep the database column name as min_price though we'll refer to it as "Reserve Price" in the UI
CREATE OR REPLACE FUNCTION public.update_dutch_auction_prices()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Only decrease the price if there's no highest bid or if the calculated price would still be higher than the reserve price
  UPDATE products
  SET current_price = 
    CASE 
      -- If there's a highest bid, use it as the minimum price
      WHEN highest_bid IS NOT NULL THEN 
        GREATEST(
          min_price, -- min_price is the reserve price
          highest_bid,
          GREATEST(
            min_price,
            current_price - COALESCE(price_decrement, 0)
          )
        )
      -- Otherwise, just decrease the price as normal
      ELSE
        GREATEST(
          min_price, -- min_price is the reserve price
          current_price - COALESCE(price_decrement, 0)
        )
    END
  WHERE 
    auction_end_time > NOW()
    AND current_price > min_price
    AND price_decrement IS NOT NULL;
END;
$function$;
