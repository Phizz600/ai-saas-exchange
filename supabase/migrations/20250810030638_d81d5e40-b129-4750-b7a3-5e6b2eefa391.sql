-- Update handle_new_user to robustly extract metadata and default user_type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  raw_user_meta json;
  raw_user_type text;
  first_name_val text;
  last_name_val text;
BEGIN
  -- Store the full raw user meta data for logging
  raw_user_meta := COALESCE(new.raw_user_meta_data, '{}'::json);
  
  -- Extract values with proper null handling
  raw_user_type := COALESCE(raw_user_meta->>'user_type', '');
  first_name_val := COALESCE(raw_user_meta->>'first_name', '');
  last_name_val := COALESCE(raw_user_meta->>'last_name', '');

  -- Log the values we're working with
  RAISE LOG 'handle_new_user: Processing new user % with meta data: %', new.id, raw_user_meta;
  RAISE LOG 'handle_new_user: Extracted user_type: "%" first_name: "%" last_name: "%"', 
    raw_user_type, first_name_val, last_name_val;

  -- If user_type is empty or null, default to 'ai_investor'
  IF raw_user_type = '' OR raw_user_type IS NULL THEN
    RAISE LOG 'handle_new_user: Empty user_type detected, defaulting to ai_investor';
    raw_user_type := 'ai_investor';
  END IF;

  -- Validate user_type before proceeding
  IF raw_user_type NOT IN ('ai_builder', 'ai_investor') THEN
    RAISE LOG 'handle_new_user: Invalid user_type: "%" (length: %), defaulting to ai_investor. Full meta data: %', 
      raw_user_type, length(raw_user_type), raw_user_meta;
    raw_user_type := 'ai_investor';
  END IF;

  -- Create the profile with explicitly initialized fields
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    user_type,
    created_at,
    updated_at,
    liked_products,
    saved_products,
    bio,
    full_name,
    avatar_url,
    username
  )
  VALUES (
    new.id,
    NULLIF(first_name_val, ''),
    NULLIF(last_name_val, ''),
    raw_user_type::user_type,
    now(),
    now(),
    '{}', -- Empty array for liked_products
    '{}', -- Empty array for saved_products
    NULL, -- No bio
    NULL, -- No full name
    NULL, -- No avatar
    NULL  -- No username
  );
  
  -- If the user is an investor, create an empty preferences record
  IF raw_user_type = 'ai_investor' THEN
    INSERT INTO investor_preferences (
      user_id,
      current_question,
      preferred_categories,
      preferred_industries,
      investment_timeline,
      max_investment,
      min_investment,
      required_integrations,
      technical_expertise,
      risk_appetite,
      target_market,
      investment_stage,
      business_model
    ) VALUES (
      new.id,
      0, -- Start at the first question
      '{}', -- Empty arrays for all preference fields
      '{}',
      NULL,
      NULL,
      NULL,
      '{}',
      NULL,
      '{}',
      '{}',
      '{}',
      '{}'
    );
  END IF;
  
  RAISE LOG 'handle_new_user: Successfully created profile for user % with user_type %', 
    new.id, raw_user_type;
  
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log any errors that occur
  RAISE LOG 'handle_new_user error: % % - Meta data was: %', SQLERRM, SQLSTATE, raw_user_meta;
  RAISE;
END;
$function$;

-- Ensure triggers are set up to call new-user handlers
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE t.tgname = 'on_auth_user_created' AND n.nspname = 'auth' AND c.relname = 'users'
  ) THEN
    EXECUTE 'DROP TRIGGER on_auth_user_created ON auth.users';
  END IF;
END$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE t.tgname = 'on_auth_user_created_email_preferences' AND n.nspname = 'auth' AND c.relname = 'users'
  ) THEN
    EXECUTE 'DROP TRIGGER on_auth_user_created_email_preferences ON auth.users';
  END IF;
END$$;

CREATE TRIGGER on_auth_user_created_email_preferences
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_email_preferences();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE t.tgname = 'on_auth_user_created_verifications' AND n.nspname = 'auth' AND c.relname = 'users'
  ) THEN
    EXECUTE 'DROP TRIGGER on_auth_user_created_verifications ON auth.users';
  END IF;
END$$;

CREATE TRIGGER on_auth_user_created_verifications
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_verifications();