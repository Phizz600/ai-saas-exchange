-- Add subscription tracking to package_purchases table
ALTER TABLE package_purchases ADD COLUMN IF NOT EXISTS subscription_type TEXT;
ALTER TABLE package_purchases ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';
ALTER TABLE package_purchases ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMPTZ;
ALTER TABLE package_purchases ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE package_purchases ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'monthly';

-- Create dedicated user_subscriptions table for better subscription management
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subscription_type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  amount NUMERIC NOT NULL,
  billing_cycle TEXT DEFAULT 'monthly',
  next_billing_date TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_subscriptions
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON user_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage subscriptions" 
ON user_subscriptions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to check if user has active marketplace subscription
CREATE OR REPLACE FUNCTION public.has_marketplace_access(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check for active marketplace subscription
  RETURN EXISTS (
    SELECT 1 
    FROM user_subscriptions 
    WHERE user_id = check_user_id 
    AND subscription_type = 'marketplace-subscription'
    AND status = 'active'
    AND (current_period_end IS NULL OR current_period_end > NOW())
  );
END;
$$;

-- Create function to update subscription updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for subscription updates
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_updated_at();