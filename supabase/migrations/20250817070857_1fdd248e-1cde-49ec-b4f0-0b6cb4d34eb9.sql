
-- Add a JSONB column to store generated valuation results for each lead
ALTER TABLE public.valuation_leads
ADD COLUMN IF NOT EXISTS valuation_result jsonb;
