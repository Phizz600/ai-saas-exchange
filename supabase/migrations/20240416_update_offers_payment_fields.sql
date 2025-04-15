
-- Add payment-related fields to offers table
ALTER TABLE offers 
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS payment_method_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_amount NUMERIC;

-- Create index for payment_intent_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_offers_payment_intent_id ON offers(payment_intent_id);
