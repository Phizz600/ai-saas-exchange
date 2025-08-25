-- Fix security issue: Add RLS policies to secure_valuation_leads table
-- This table currently has NO RLS policies, allowing unauthorized access to customer emails

-- First, enable RLS on secure_valuation_leads if not already enabled
ALTER TABLE public.secure_valuation_leads ENABLE ROW LEVEL SECURITY;

-- Add policy to allow only authorized admins to view secure valuation leads
-- This matches the security pattern used in valuation_leads table
CREATE POLICY "Authorized admins can view secure valuation leads" 
ON public.secure_valuation_leads 
FOR SELECT 
USING (
  -- User must be an admin
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  )
  AND
  -- User must be in the authorized_lead_viewers list
  EXISTS (
    SELECT 1 FROM public.admin_settings 
    WHERE key = 'authorized_lead_viewers' 
    AND value ? auth.uid()::text
  )
);

-- Allow anonymous inserts for lead capture forms (same as valuation_leads)
CREATE POLICY "Allow anonymous inserts to secure valuation leads" 
ON public.secure_valuation_leads 
FOR INSERT 
WITH CHECK (true);

-- Add trigger to log access attempts to secure_valuation_leads
-- This provides audit trail for who is accessing sensitive customer data
CREATE TRIGGER log_secure_lead_access_trigger
  BEFORE SELECT ON public.secure_valuation_leads
  FOR EACH ROW 
  EXECUTE FUNCTION public.log_lead_access_attempt();

-- Update the existing trigger function to handle both tables
CREATE OR REPLACE FUNCTION public.log_lead_access_attempt()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  is_authorized BOOLEAN;
  requester uuid;
  table_accessed TEXT;
BEGIN
  requester := auth.uid();
  table_accessed := TG_TABLE_NAME;

  -- If no authenticated user, skip logging to avoid NULL admin_id
  IF requester IS NULL THEN
    RETURN OLD;
  END IF;

  -- Check if user is authorized
  SELECT EXISTS (
    SELECT 1 FROM public.admin_settings
    WHERE key = 'authorized_lead_viewers'
      AND value ? requester::text
  ) INTO is_authorized;

  -- Log all access attempts (authorized or not)
  INSERT INTO public.admin_activity_log (admin_id, action, details)
  VALUES (
    requester,
    CASE WHEN is_authorized THEN 'secure_lead_accessed' ELSE 'secure_lead_access_denied' END,
    jsonb_build_object(
      'table_accessed', table_accessed,
      'lead_id', OLD.id,
      'lead_email', OLD.email,
      'access_timestamp', NOW(),
      'authorized', is_authorized,
      'action_type', 'SELECT_ATTEMPT'
    )
  );

  RETURN OLD;
END;
$function$;