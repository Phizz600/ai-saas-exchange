-- Fix Security Definer View Issue - Remove embedded authorization logic
-- The view should rely on RLS policies from the base table instead

-- Drop the current problematic view
DROP VIEW IF EXISTS public.secure_valuation_leads;

-- Recreate the view as a simple pass-through without embedded authorization
-- This will properly inherit RLS from the valuation_leads table
CREATE VIEW public.secure_valuation_leads AS
SELECT 
  id,
  name,
  company,
  email,
  quiz_answers,
  created_at
FROM public.valuation_leads;

-- Add comment explaining the security model
COMMENT ON VIEW public.secure_valuation_leads IS 'Secure view for accessing valuation leads - inherits RLS policies from valuation_leads table for proper authorization.';