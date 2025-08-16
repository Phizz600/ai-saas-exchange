-- COMPLETE CLEANUP: Remove ALL triggers and functions that might interfere with auth
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all triggers on auth.users table
    FOR r IN (SELECT trigger_name FROM information_schema.triggers WHERE event_object_table = 'users' AND event_object_schema = 'auth') 
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || r.trigger_name || ' ON auth.users CASCADE';
    END LOOP;
    
    -- Drop all functions that might be related to user handling
    FOR r IN (SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name LIKE '%user%') 
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || r.routine_name || ' CASCADE';
    END LOOP;
END $$;

-- Ensure profiles table has correct structure
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    user_type TEXT CHECK (user_type IN ('ai_builder', 'ai_investor')),
    liked_products UUID[] DEFAULT '{}',
    saved_products UUID[] DEFAULT '{}',
    bio TEXT,
    full_name TEXT,
    avatar_url TEXT,
    username TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, working RLS policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles  
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);