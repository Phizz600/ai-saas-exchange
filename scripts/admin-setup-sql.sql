-- Admin Setup SQL Script
-- Run this in Supabase Dashboard > SQL Editor

-- 1. First, check if there are any existing admin users
SELECT 
    ur.user_id,
    ur.role,
    au.email,
    au.created_at
FROM user_roles ur
LEFT JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role = 'admin';

-- 2. If no admin users exist, you need to:
--    a) Create a user account first (sign up on the website)
--    b) Get the user ID from auth.users table
--    c) Insert the admin role

-- 3. To make a specific user an admin, replace 'USER_ID_HERE' with the actual user ID:
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('USER_ID_HERE', 'admin');

-- 4. To find a user by email and make them admin:
-- First, find the user ID:
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then insert the admin role (replace with the actual user ID):
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('USER_ID_FROM_ABOVE_QUERY', 'admin');

-- 5. Verify the admin role was added:
-- SELECT 
--     ur.user_id,
--     ur.role,
--     au.email
-- FROM user_roles ur
-- LEFT JOIN auth.users au ON ur.user_id = au.id
-- WHERE ur.role = 'admin';
