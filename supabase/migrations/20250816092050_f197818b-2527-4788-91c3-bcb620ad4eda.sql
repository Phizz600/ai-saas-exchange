-- Fix security issues by implementing proper RLS policies

-- 1. Fix valuation_leads table - restrict read access to admins only
DROP POLICY IF EXISTS "valuation_leads_select_policy" ON public.valuation_leads;
CREATE POLICY "Admin can view valuation leads" 
ON public.valuation_leads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  )
);

-- 2. Fix secure_valuation_leads table - add RLS and restrict to admins
ALTER TABLE public.secure_valuation_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view secure valuation leads" 
ON public.secure_valuation_leads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admin can insert secure valuation leads" 
ON public.secure_valuation_leads 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  )
);

CREATE POLICY "Admin can update secure valuation leads" 
ON public.secure_valuation_leads 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  )
);

-- 3. Fix offers table - restrict visibility to bidder and product owner only
DROP POLICY IF EXISTS "offers_select_policy" ON public.offers;
CREATE POLICY "Users can view their own offers or offers on their products" 
ON public.offers 
FOR SELECT 
USING (
  bidder_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = offers.product_id 
    AND products.seller_id = auth.uid()
  )
);

-- 4. Fix product_analytics table - restrict to product owners and admins
DROP POLICY IF EXISTS "product_analytics_select_policy" ON public.product_analytics;
CREATE POLICY "Product owners and admins can view analytics" 
ON public.product_analytics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = product_analytics.product_id 
    AND products.seller_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  )
);

-- 5. Add admin role check for price_history if needed (optional - keeping current transparency)
-- For now, keeping price_history publicly readable as it may be intentional for market transparency

-- 6. Enable leaked password protection (auth configuration)
-- This needs to be done in Supabase Dashboard: Authentication > Settings > Security
-- Enable "Block weak and breached passwords"

-- Add comment to document the security fixes
COMMENT ON TABLE public.secure_valuation_leads IS 'Contains sensitive lead data - access restricted to admins only via RLS policies';
COMMENT ON TABLE public.offers IS 'Business negotiation data - access restricted to involved parties only via RLS policies';
COMMENT ON TABLE public.product_analytics IS 'Business intelligence data - access restricted to product owners and admins via RLS policies';