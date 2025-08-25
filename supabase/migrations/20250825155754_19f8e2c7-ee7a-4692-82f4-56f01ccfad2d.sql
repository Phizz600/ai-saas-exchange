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

-- Also add a general admin policy as backup (similar to valuation_leads table)
CREATE POLICY "Admins can view secure valuation leads" 
ON public.secure_valuation_leads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  )
);