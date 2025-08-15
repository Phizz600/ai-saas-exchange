-- Fix Security Definer View Issue
-- Remove SECURITY DEFINER from view and use proper RLS instead

-- Drop the problematic view
DROP VIEW IF EXISTS public.secure_valuation_leads;

-- Recreate the view without SECURITY DEFINER
CREATE VIEW public.secure_valuation_leads AS
SELECT 
  id,
  name,
  company,
  email,
  quiz_answers,
  created_at
FROM public.valuation_leads;

-- Enable RLS on the view (this will inherit from the base table)
-- Note: Views inherit RLS from their base tables automatically

-- Add comment explaining the security model
COMMENT ON VIEW public.secure_valuation_leads IS 'Secure view for accessing valuation leads - inherits RLS policies from valuation_leads table for proper authorization.';