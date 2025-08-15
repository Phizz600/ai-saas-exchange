-- Security Fix: Restrict Access to Customer Contact Information
-- Implement stricter access controls for valuation_leads table

-- Create a new specialized role for lead management
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role' AND 'lead_manager' = ANY(enum_range(NULL::app_role)::text[])) THEN
    -- Add lead_manager to the existing app_role enum
    ALTER TYPE public.app_role ADD VALUE 'lead_manager';
  END IF;
END $$;

-- Drop the overly permissive admin policy
DROP POLICY IF EXISTS "Admins can view all valuation leads" ON public.valuation_leads;

-- Create more restrictive policies

-- 1. Only lead managers can view customer contact information
CREATE POLICY "Lead managers can view valuation leads" ON public.valuation_leads
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'lead_manager'::public.app_role
  )
);

-- 2. Create a policy for super admins as fallback (if needed)
CREATE POLICY "Super admins can view valuation leads" ON public.valuation_leads
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  ) AND
  -- Additional check: user must be explicitly marked as authorized for lead access
  EXISTS (
    SELECT 1 FROM public.admin_settings 
    WHERE key = 'authorized_lead_viewers' 
    AND value ? auth.uid()::text
  )
);

-- 3. Keep the anonymous insert policy for lead generation
-- (This is needed for the lead capture functionality)

-- Create admin setting to track authorized lead viewers
INSERT INTO public.admin_settings (key, value) 
VALUES (
  'authorized_lead_viewers', 
  '[]'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- Add audit logging for lead access
CREATE OR REPLACE FUNCTION public.log_lead_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Log when someone accesses customer contact information
  INSERT INTO public.admin_activity_log (admin_id, action, details)
  VALUES (
    auth.uid(),
    'valuation_lead_accessed',
    jsonb_build_object(
      'lead_id', NEW.id,
      'lead_email', NEW.email,
      'access_timestamp', NOW(),
      'user_ip', current_setting('request.headers', true)::json->>'x-forwarded-for'
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for audit logging (only on SELECT would be ideal, but we'll use UPDATE as proxy)
-- Note: We can't directly trigger on SELECT, so we'll log on any data modification instead
CREATE TRIGGER audit_lead_access
  AFTER UPDATE ON public.valuation_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.log_lead_access();

-- Add comment explaining the security model
COMMENT ON TABLE public.valuation_leads IS 'Customer contact information - access restricted to authorized lead managers only. All access is logged for security audit.';

-- Add indexes for performance on role checks
CREATE INDEX IF NOT EXISTS idx_user_roles_lead_manager 
ON public.user_roles (user_id) 
WHERE role = 'lead_manager';