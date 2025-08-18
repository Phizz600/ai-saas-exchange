
-- 1) Harden audit/logging functions to gracefully no-op for anonymous callers
-- This prevents "null value in column admin_id" errors when users are not logged in.

CREATE OR REPLACE FUNCTION public.log_admin_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  admin_uid uuid;
BEGIN
  admin_uid := auth.uid();
  -- If there's no authenticated user, skip logging
  IF admin_uid IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.admin_activity_log (admin_id, action, details)
  VALUES (admin_uid, TG_ARGV[0], row_to_json(NEW));
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_sensitive_data_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  admin_uid uuid;
BEGIN
  admin_uid := auth.uid();
  -- Skip logging if anonymous
  IF admin_uid IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  INSERT INTO public.admin_activity_log (admin_id, action, details)
  VALUES (
    admin_uid,
    TG_TABLE_NAME || '_' || lower(TG_OP),
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'timestamp', NOW(),
      'user_id', admin_uid,
      'old_data', CASE WHEN TG_OP IN ('DELETE','UPDATE') THEN row_to_json(OLD) ELSE NULL END,
      'new_data', CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN row_to_json(NEW) ELSE NULL END
    )
  );

  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_lead_access_attempt()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  is_authorized BOOLEAN;
  requester uuid;
BEGIN
  requester := auth.uid();

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
    CASE WHEN is_authorized THEN 'valuation_lead_accessed' ELSE 'valuation_lead_access_denied' END,
    jsonb_build_object(
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

-- 2) Add a database-level email format validator for valuation leads
-- (UI will also validate; this is a final safety net.)

CREATE OR REPLACE FUNCTION public.validate_valuation_lead_email()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  -- Basic RFC-compliant-ish email regex; avoids allowing obviously invalid emails
  IF NEW.email IS NULL
     OR NEW.email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  THEN
    RAISE EXCEPTION 'Invalid email address';
  END IF;

  -- Optional: guard against excessively long emails (defense-in-depth)
  IF length(NEW.email) > 320 THEN
    RAISE EXCEPTION 'Email address too long';
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_validate_valuation_lead_email ON public.valuation_leads;
CREATE TRIGGER trg_validate_valuation_lead_email
BEFORE INSERT OR UPDATE ON public.valuation_leads
FOR EACH ROW
EXECUTE FUNCTION public.validate_valuation_lead_email();
