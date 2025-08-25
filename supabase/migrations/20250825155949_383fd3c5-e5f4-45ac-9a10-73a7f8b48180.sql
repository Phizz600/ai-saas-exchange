-- Remove the unnecessary secure_valuation_leads view
-- The underlying valuation_leads table already has proper RLS policies
-- and this view is not being used in the application

DROP VIEW IF EXISTS public.secure_valuation_leads;

-- Verify that the valuation_leads table has proper RLS policies
-- (This is just a comment - the policies already exist and are working correctly)
-- Current policies on valuation_leads:
-- 1. "Admin can view valuation leads" - admins can SELECT
-- 2. "Authorized admins can view valuation leads" - authorized admins can SELECT  
-- 3. "Allow anonymous inserts" - anyone can INSERT for lead capture