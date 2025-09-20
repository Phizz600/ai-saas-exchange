-- Create package_purchases table to track user package purchases
CREATE TABLE public.package_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  package_type TEXT NOT NULL CHECK (package_type IN ('starter', 'growth', 'scale')),
  amount NUMERIC NOT NULL,
  payment_intent_id TEXT UNIQUE,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'succeeded', 'failed', 'cancelled')),
  benefits JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.package_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own package purchases
CREATE POLICY "Users can view their own package purchases"
ON public.package_purchases
FOR SELECT
USING (auth.uid() = user_id);

-- System can create package purchases
CREATE POLICY "System can create package purchases"
ON public.package_purchases
FOR INSERT
WITH CHECK (true);

-- System can update package purchases  
CREATE POLICY "System can update package purchases"
ON public.package_purchases
FOR UPDATE
USING (true);

-- Create function to update package purchase timestamps
CREATE OR REPLACE FUNCTION public.update_package_purchase_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_package_purchases_updated_at
BEFORE UPDATE ON public.package_purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_package_purchase_updated_at();