-- Add missing last_name column to profiles table
-- This is what's causing the signup failures - the function tries to insert last_name but the column doesn't exist

ALTER TABLE public.profiles 
ADD COLUMN last_name text;