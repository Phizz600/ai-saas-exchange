
-- Create function to update highest bid if the new bid is higher
CREATE OR REPLACE FUNCTION update_highest_bid_if_higher(
  p_product_id UUID,
  p_bid_amount NUMERIC,
  p_bidder_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_highest_bid NUMERIC;
BEGIN
  -- Get the current highest bid
  SELECT highest_bid INTO current_highest_bid
  FROM products
  WHERE id = p_product_id;
  
  -- Only update if the new bid is higher or there is no current highest bid
  IF current_highest_bid IS NULL OR p_bid_amount > current_highest_bid THEN
    UPDATE products
    SET 
      highest_bid = p_bid_amount,
      highest_bidder_id = p_bidder_id,
      current_price = p_bid_amount
    WHERE id = p_product_id;
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;
