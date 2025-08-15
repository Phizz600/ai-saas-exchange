-- Fix the secure_valuation_leads view security vulnerability
-- The view currently exposes all data without proper authorization checks

-- Drop the insecure view
DROP VIEW IF EXISTS public.secure_valuation_leads;

-- Recreate the view with proper authorization filtering
-- This view will only show data to users who pass the same authorization checks as the base table
CREATE VIEW public.secure_valuation_leads AS
SELECT 
  id,
  name,
  company,
  email,
  quiz_answers,
  created_at
FROM public.valuation_leads
WHERE 
  -- Same authorization logic as the valuation_leads table RLS policy
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'::app_role
  ) 
  AND EXISTS (
    SELECT 1 
    FROM public.admin_settings 
    WHERE admin_settings.key = 'authorized_lead_viewers' 
    AND admin_settings.value ? auth.uid()::text
  );

-- Add security barrier to prevent query optimization from bypassing security checks
ALTER VIEW public.secure_valuation_leads SET (security_barrier = true);

-- Add comment explaining the security model
COMMENT ON VIEW public.secure_valuation_leads IS 'Secure view for valuation leads - enforces same authorization as base table: only authorized admin users can access this sensitive customer data.';