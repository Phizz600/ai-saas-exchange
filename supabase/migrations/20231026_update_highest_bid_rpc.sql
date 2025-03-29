
-- Create a stored procedure to update highest bid if the new bid is higher
CREATE OR REPLACE FUNCTION update_highest_bid_if_higher(
  p_product_id UUID,
  p_bid_amount NUMERIC,
  p_bidder_id UUID
) RETURNS VOID AS $$
BEGIN
  -- Check if the bid is higher than the current highest bid or the current price
  IF NOT EXISTS (
    SELECT 1 FROM products 
    WHERE id = p_product_id 
    AND (highest_bid IS NOT NULL AND p_bid_amount <= highest_bid)
  ) THEN
    -- Update the product with the new highest bid
    UPDATE products
    SET highest_bid = p_bid_amount,
        highest_bidder_id = p_bidder_id,
        current_price = p_bid_amount
    WHERE id = p_product_id;
  ELSE
    RAISE EXCEPTION 'Bid amount must be higher than current highest bid';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
