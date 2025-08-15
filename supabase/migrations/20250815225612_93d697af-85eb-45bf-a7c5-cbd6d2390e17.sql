-- Fix critical security vulnerability: Enable RLS on secure_valuation_leads table
-- This table contains sensitive customer data (emails, company info) and needs protection

-- Enable Row Level Security on the secure_valuation_leads table
ALTER TABLE public.secure_valuation_leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to insert leads (for public valuation forms)
CREATE POLICY "Allow anonymous lead submission" 
ON public.secure_valuation_leads 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Create policy to restrict reading to authorized admins only
-- Only admins who are explicitly authorized to view leads can access this sensitive data
CREATE POLICY "Authorized admins can view leads" 
ON public.secure_valuation_leads 
FOR SELECT 
TO authenticated
USING (
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
  )
);

-- Prevent unauthorized updates and deletes entirely
-- No UPDATE or DELETE policies means only service role can modify data