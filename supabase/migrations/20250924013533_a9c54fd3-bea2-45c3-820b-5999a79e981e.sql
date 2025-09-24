-- Fix the validate_product_pricing function to remove references to non-existent columns
CREATE OR REPLACE FUNCTION public.validate_product_pricing()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  IF NEW.listing_type = 'fixed_price' AND NEW.price IS NULL THEN
    RAISE EXCEPTION 'Fixed price listings must have a price';
  END IF;
  
  IF NEW.listing_type = 'dutch_auction' AND NEW.auction_end_time IS NULL THEN
    RAISE EXCEPTION 'Dutch auction listings must have auction_end_time';
  END IF;
  
  RETURN NEW;
END;
$function$;