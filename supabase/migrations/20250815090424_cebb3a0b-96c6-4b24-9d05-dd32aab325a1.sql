-- Security Fix Phase 1: Critical Data Protection (Fixed)

-- 1. Fix valuation_leads table security
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

-- 2. Update database extensions to latest recommended versions
ALTER EXTENSION IF EXISTS pg_cron UPDATE;
ALTER EXTENSION IF EXISTS pg_stat_statements UPDATE;

-- 3. Clean up redundant RLS policies on profiles table
-- Remove duplicate/overlapping policies, keeping the most secure ones
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read any profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- 4. Clean up redundant RLS policies on products table  
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Enable read access for active products" ON public.products;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.products;
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Users can view active products" ON public.products;

-- 5. Add security audit logging function for INSERT/UPDATE/DELETE operations
CREATE OR REPLACE FUNCTION public.log_sensitive_data_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log changes to sensitive tables
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

-- Add triggers for sensitive data change logging (valid operations only)
CREATE TRIGGER log_valuation_leads_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.valuation_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.log_sensitive_data_changes();

CREATE TRIGGER log_user_roles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW  
  EXECUTE FUNCTION public.log_sensitive_data_changes();

-- 6. Create security documentation table
CREATE TABLE IF NOT EXISTS public.security_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  policy_name TEXT NOT NULL,
  policy_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on security policies table
ALTER TABLE public.security_policies ENABLE ROW LEVEL SECURITY;

-- Only admins can manage security policies documentation
CREATE POLICY "Admins can manage security policies"
ON public.security_policies
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Insert documentation for current security policies
INSERT INTO public.security_policies (table_name, policy_name, policy_type, description) VALUES
('valuation_leads', 'Admins can view all valuation leads', 'SELECT', 'Restricts access to valuation leads to admin users only'),
('profiles', 'Users can view own profile and sellers', 'SELECT', 'Allows users to view their own profile and profiles of active sellers'),
('user_roles', 'Admins can manage user roles', 'ALL', 'Allows admin users to manage role assignments'),
('notifications', 'Users can view their own notifications', 'SELECT', 'Users can only see notifications intended for them'),
('admin_activity_log', 'Admins can read activity logs', 'SELECT', 'Admin users can view system activity logs'),
('security_policies', 'Admins can manage security policies', 'ALL', 'Admin users can manage security policy documentation');

-- 7. Add constraint to ensure security policy integrity
ALTER TABLE public.security_policies 
ADD CONSTRAINT valid_policy_type 
CHECK (policy_type IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE', 'ALL'));

-- 8. Create function to check if current user is admin (for app usage)
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