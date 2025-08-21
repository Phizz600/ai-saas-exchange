-- Add user type tracking column to profiles table for better auth tracking
-- The profiles table already exists and has user_type, but let's ensure it's properly indexed and has the right constraints

-- First, let's make sure the user_type column has proper constraints
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN ('ai_builder', 'ai_investor'));

-- Add an index on user_type for better query performance when filtering by user type
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);

-- Add an index on the combination of user_type and created_at for analytics
CREATE INDEX IF NOT EXISTS idx_profiles_user_type_created_at ON public.profiles(user_type, created_at);

-- Also ensure the user_type field is not nullable to enforce proper data integrity
-- (This may fail if there are existing records with null user_type, which is okay)
DO $$
BEGIN
  ALTER TABLE public.profiles ALTER COLUMN user_type SET NOT NULL;
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Could not set user_type to NOT NULL - there may be existing records with null values';
END $$;