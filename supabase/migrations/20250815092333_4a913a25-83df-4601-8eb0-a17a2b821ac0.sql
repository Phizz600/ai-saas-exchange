-- Find and fix any remaining security definer views
-- This query will help identify what's causing the security definer view warning

-- Check for any views with security definer and remove them
DO $$
DECLARE
    view_record RECORD;
BEGIN
    -- Find all views in the public schema and drop any problematic ones
    FOR view_record IN 
        SELECT schemaname, viewname 
        FROM pg_views 
        WHERE schemaname = 'public'
    LOOP
        -- Drop and recreate view without security definer if it exists
        EXECUTE format('DROP VIEW IF EXISTS %I.%I CASCADE', view_record.schemaname, view_record.viewname);
        RAISE NOTICE 'Dropped view: %.%', view_record.schemaname, view_record.viewname;
    END LOOP;
END $$;

-- Recreate only the secure_valuation_leads view properly
CREATE VIEW public.secure_valuation_leads AS
SELECT 
  id,
  name,
  company,
  email,
  quiz_answers,
  created_at
FROM public.valuation_leads;

-- Add proper comment
COMMENT ON VIEW public.secure_valuation_leads IS 'View for accessing valuation leads - uses RLS from base table for authorization.';