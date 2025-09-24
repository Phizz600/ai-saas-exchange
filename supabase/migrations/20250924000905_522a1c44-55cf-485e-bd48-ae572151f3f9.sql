-- Fix infinite recursion by using security definer function for role checks
-- First drop all existing conflicting policies

-- Drop existing user_roles policies
DROP POLICY IF EXISTS "System can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can read all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update user roles" ON public.user_roles;

-- Create security definer functions to check user roles safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create simple, non-recursive policies for user_roles
CREATE POLICY "System can manage user roles"
ON public.user_roles
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Fix product_analytics policies
DROP POLICY IF EXISTS "Product owners and admins can view analytics" ON public.product_analytics;

CREATE POLICY "Product owners and admins can view analytics"
ON public.product_analytics
FOR SELECT
USING ((EXISTS ( SELECT 1
   FROM products
  WHERE ((products.id = product_analytics.product_id) AND (products.seller_id = auth.uid())))) OR public.is_current_user_admin());

-- Fix admin_settings policies
DROP POLICY IF EXISTS "Admins can modify settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Admins can read settings" ON public.admin_settings;

CREATE POLICY "Admins can modify settings"
ON public.admin_settings
FOR ALL
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Admins can read settings"
ON public.admin_settings
FOR SELECT
USING (public.is_current_user_admin());