-- Add new fields for form reorganization
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS key_features text,
  ADD COLUMN IF NOT EXISTS revenue_trend text CHECK (revenue_trend IN ('growing', 'stable', 'declining'));

-- Add comment to describe the fields
COMMENT ON COLUMN products.key_features IS 'Comma-separated list of key product features';
COMMENT ON COLUMN products.revenue_trend IS 'Last 3 months revenue trend: growing, stable, or declining';