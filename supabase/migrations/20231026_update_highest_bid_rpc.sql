
-- Create a stored procedure to update highest bid if the new bid is higher
CREATE OR REPLACE FUNCTION update_highest_bid_if_higher(
  p_product_id UUID,
  p_bid_amount NUMERIC,
  p_bidder_id UUID
) RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET highest_bid = p_bid_amount,
      highest_bidder_id = p_bidder_id,
      current_price = p_bid_amount
  WHERE id = p_product_id
    AND (highest_bid IS NULL OR p_bid_amount > highest_bid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
