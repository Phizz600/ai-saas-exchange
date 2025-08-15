-- Security Fix Phase 2: Address Linter Warnings

-- 1. Fix search_path for security functions
CREATE OR REPLACE FUNCTION public.log_sensitive_data_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.admin_activity_log (admin_id, action, details)
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

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  );
$$;

-- 2. Update extensions to latest versions
-- Note: Extension updates may require manual intervention in some cases
DO $$
BEGIN
  -- Try to update pg_cron if it exists
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    ALTER EXTENSION pg_cron UPDATE;
  END IF;
  
  -- Try to update pg_stat_statements if it exists  
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements') THEN
    ALTER EXTENSION pg_stat_statements UPDATE;
  END IF;
END $$;