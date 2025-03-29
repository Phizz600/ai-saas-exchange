
-- Add deposit fields and status to bids table
ALTER TABLE bids 
ADD COLUMN IF NOT EXISTS deposit_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC,
ADD COLUMN IF NOT EXISTS deposit_transaction_id UUID;

-- Create a function to calculate bid deposit amount
CREATE OR REPLACE FUNCTION calculate_bid_deposit_amount(bid_amount numeric)
RETURNS numeric
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN ROUND(bid_amount * 0.10, 2);  -- 10% of the bid amount
END;
$$;

-- Add bid_id column to deposit_transactions table
ALTER TABLE deposit_transactions
ADD COLUMN IF NOT EXISTS bid_id UUID REFERENCES bids(id);
