-- Fix 1: Create admin role system
-- First ensure we have admin role enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
    END IF;
END$$;

-- Add RLS policies for user_roles table
CREATE POLICY "Admins can read all user roles" 
ON public.user_roles 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
));

CREATE POLICY "Admins can insert user roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
));

CREATE POLICY "Admins can update user roles" 
ON public.user_roles 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
));

CREATE POLICY "Admins can delete user roles" 
ON public.user_roles 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
));

-- Fix 2: Secure all database functions by adding search_path
-- Update all existing functions to be secure
ALTER FUNCTION public.update_product_analytics() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.is_valid_user_type(text) SET search_path = '';
ALTER FUNCTION public.notify_product_sold() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.is_high_traffic(integer, integer, integer) SET search_path = '';
ALTER FUNCTION public.validate_bid_amount() SET search_path = '';
ALTER FUNCTION public.update_highest_bid() SET search_path = '';
ALTER FUNCTION public.update_draft_updated_at() SET search_path = '';
ALTER FUNCTION public.increment_product_saves() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.check_product_liked(uuid, uuid) SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.notify_offer_status_change() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.update_dutch_auction_prices() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.notify_new_offer() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.create_conversation_on_offer_accepted() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.notify_new_bid() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.check_auctions_ending_soon() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.create_conversation_on_auction_end() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.update_conversation_last_message() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.notify_message_recipient() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.notify_product_interactions() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.calculate_platform_fee(numeric) SET search_path = '';
ALTER FUNCTION public.get_daily_views_count(uuid) SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.record_initial_price() SET search_path = '';
ALTER FUNCTION public.record_bid_price() SET search_path = '';
ALTER FUNCTION public.calculate_offer_deposit_amount(numeric) SET search_path = '';
ALTER FUNCTION public.handle_new_user() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.truncate_to_date(timestamp with time zone) SET search_path = '';
ALTER FUNCTION public.has_role(uuid, app_role) STABLE SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.update_nda_updated_at() SET search_path = '';
ALTER FUNCTION public.update_submission_timestamp() SET search_path = '';
ALTER FUNCTION public.update_payment_timestamp() SET search_path = '';
ALTER FUNCTION public.validate_product_status_transitions() SET search_path = '';
ALTER FUNCTION public.notify_product_status_change() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.set_product_listing_type() SET search_path = '';
ALTER FUNCTION public.validate_product_pricing() SET search_path = '';
ALTER FUNCTION public.notify_escrow_status_change() SET search_path = '';
ALTER FUNCTION public.log_admin_activity() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.handle_new_user_email_preferences() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.is_verified(uuid, verification_type) SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.handle_new_user_verifications() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.calculate_bid_deposit_amount(numeric) SET search_path = '';
ALTER FUNCTION public.update_product_highest_bid_on_cancellation() SET search_path = '';
ALTER FUNCTION public.increment_product_views(uuid) SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.check_high_traffic() SECURITY DEFINER SET search_path = '';