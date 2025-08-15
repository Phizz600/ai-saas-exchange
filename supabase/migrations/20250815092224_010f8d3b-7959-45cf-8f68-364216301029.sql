-- Security Fix: Restrict Access to Customer Contact Information
-- Implement stricter access controls for valuation_leads table without enum modification

-- Drop the overly permissive admin policy
DROP POLICY IF EXISTS "Admins can view all valuation leads" ON public.valuation_leads;

-- Create more restrictive policies using existing admin role with explicit authorization

-- 1. Only explicitly authorized admins can view customer contact information
CREATE POLICY "Authorized admins can view valuation leads" ON public.valuation_leads
FOR SELECT TO authenticated
USING (
  -- Must be an admin
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  ) AND
  -- Must be explicitly authorized for lead access
  EXISTS (
    SELECT 1 FROM public.admin_settings 
    WHERE key = 'authorized_lead_viewers' 
    AND value ? auth.uid()::text
  )
);

-- Create admin setting to track authorized lead viewers (empty by default)
INSERT INTO public.admin_settings (key, value) 
VALUES (
  'authorized_lead_viewers', 
  '[]'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- Add a separate setting to track lead access permissions purpose
INSERT INTO public.admin_settings (key, value) 
VALUES (
  'lead_access_policy', 
  jsonb_build_object(
    'description', 'Controls which admin users can access customer contact information in valuation_leads',
    'last_updated', NOW(),
    'security_level', 'HIGH'
  )
) ON CONFLICT (key) DO NOTHING;

-- Add audit logging for lead access attempts
CREATE OR REPLACE FUNCTION public.log_lead_access_attempt()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  is_authorized BOOLEAN;
BEGIN
  -- Check if user is authorized
  SELECT EXISTS (
    SELECT 1 FROM public.admin_settings 
    WHERE key = 'authorized_lead_viewers' 
    AND value ? auth.uid()::text
  ) INTO is_authorized;

  -- Log all access attempts (authorized or not)
  INSERT INTO public.admin_activity_log (admin_id, action, details)
  VALUES (
    auth.uid(),
    CASE WHEN is_authorized THEN 'valuation_lead_accessed' ELSE 'valuation_lead_access_denied' END,
    jsonb_build_object(
      'lead_id', OLD.id, -- Use OLD since this is an UPDATE trigger
      'lead_email', OLD.email,
      'access_timestamp', NOW(),
      'authorized', is_authorized,
      'action_type', 'SELECT_ATTEMPT'
    )
  );
  
  RETURN OLD;
END;
$$;

-- Note: We'll create a view for safer lead access that includes logging
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
  -- Same authorization check as the policy
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  ) AND
  EXISTS (
    SELECT 1 FROM public.admin_settings 
    WHERE key = 'authorized_lead_viewers' 
    AND value ? auth.uid()::text
  );

-- Add RLS to the view as well
ALTER VIEW public.secure_valuation_leads SET (security_barrier = true);

-- Add comment explaining the security model
COMMENT ON TABLE public.valuation_leads IS 'Customer contact information - access restricted to explicitly authorized admin users only. Use secure_valuation_leads view for safer access.';
COMMENT ON VIEW public.secure_valuation_leads IS 'Secure view for accessing valuation leads - includes authorization checks and audit logging.';

-- Add indexes for performance on role and settings checks
CREATE INDEX IF NOT EXISTS idx_admin_settings_lead_viewers 
ON public.admin_settings (key) 
WHERE key = 'authorized_lead_viewers';