-- Drop the problematic trigger that's causing the signup failures
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Ensure the user_type enum exists
CREATE TYPE user_type AS ENUM ('ai_builder', 'ai_investor');

-- Make sure all necessary columns exist with correct types
ALTER TABLE public.profiles 
  ALTER COLUMN user_type TYPE user_type USING user_type::user_type;