
-- Add payment-related fields to bids table
ALTER TABLE bids 
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS payment_method_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_amount NUMERIC;

-- Create index for payment_intent_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_bids_payment_intent_id ON bids(payment_intent_id);
