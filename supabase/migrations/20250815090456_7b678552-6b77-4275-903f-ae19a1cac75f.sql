-- Security Fix Phase 1: Critical Data Protection (Core Fixes)

-- 1. Fix valuation_leads table security - CRITICAL
-- Remove the overly permissive public read policy
DROP POLICY IF EXISTS "Allow read access" ON public.valuation_leads;

-- Create restrictive admin-only policy for viewing leads
CREATE POLICY "Admins can view all valuation leads"
ON public.valuation_leads
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- 2. Clean up redundant RLS policies on profiles table
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read any profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- 3. Clean up redundant RLS policies on products table  
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Enable read access for active products" ON public.products;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.products;
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Users can view active products" ON public.products;

-- 4. Add security audit logging function
CREATE OR REPLACE FUNCTION public.log_sensitive_data_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO admin_activity_log (admin_id, action, details)
  VALUES (
    auth.uid(),
    TG_TABLE_NAME || '_' || lower(TG_OP),
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'timestamp', NOW(),
      'user_id', auth.uid(),
      'old_data', CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
      'new_data', CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add triggers for sensitive data change logging
CREATE TRIGGER log_valuation_leads_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.valuation_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.log_sensitive_data_changes();

CREATE TRIGGER log_user_roles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW  
  EXECUTE FUNCTION public.log_sensitive_data_changes();

-- 5. Create admin helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  );
$$;