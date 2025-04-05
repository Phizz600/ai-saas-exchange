
-- Add indexes for faster queries on bid status and payment_status
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);
CREATE INDEX IF NOT EXISTS idx_bids_payment_status ON bids(payment_status);
CREATE INDEX IF NOT EXISTS idx_bids_product_status ON bids(product_id, status, payment_status);

-- Create a function to update product highest_bid when bids are cancelled
CREATE OR REPLACE FUNCTION update_product_highest_bid_on_cancellation()
RETURNS TRIGGER AS $$
DECLARE
  new_highest_bid NUMERIC;
  new_highest_bidder UUID;
BEGIN
  -- If a bid is being cancelled, check for a new highest bid
  IF (NEW.status = 'cancelled' OR NEW.payment_status = 'cancelled') THEN
    -- Get the new highest authorized and active bid
    SELECT amount, bidder_id INTO new_highest_bid, new_highest_bidder
    FROM bids
    WHERE product_id = NEW.product_id
      AND status = 'active'
      AND payment_status = 'authorized'
    ORDER BY amount DESC
    LIMIT 1;
    
    -- Update the product with the new highest bid, or clear it if none exists
    IF new_highest_bid IS NOT NULL THEN
      UPDATE products
      SET highest_bid = new_highest_bid,
          highest_bidder_id = new_highest_bidder,
          current_price = new_highest_bid
      WHERE id = NEW.product_id;
    ELSE
      -- If no active authorized bids exist, clear the highest bid
      UPDATE products
      SET highest_bid = NULL,
          highest_bidder_id = NULL
      WHERE id = NEW.product_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS bid_cancellation_trigger ON bids;
CREATE TRIGGER bid_cancellation_trigger
AFTER UPDATE ON bids
FOR EACH ROW
WHEN (OLD.status != 'cancelled' AND (NEW.status = 'cancelled' OR NEW.payment_status = 'cancelled'))
EXECUTE FUNCTION update_product_highest_bid_on_cancellation();
