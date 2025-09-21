-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  stage TEXT NOT NULL,
  industry TEXT,
  monthly_revenue NUMERIC,
  monthly_traffic NUMERIC,
  active_users TEXT,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  tech_stack_other TEXT,
  team_size TEXT,
  has_patents BOOLEAN DEFAULT false,
  competitors TEXT,
  demo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  special_notes TEXT,
  listing_type TEXT NOT NULL DEFAULT 'fixed_price',
  auction_end_time TIMESTAMP WITH TIME ZONE,
  starting_price NUMERIC,
  reserve_price NUMERIC,
  price_decrement NUMERIC,
  price_decrement_interval TEXT DEFAULT 'minute',
  no_reserve BOOLEAN DEFAULT false,
  current_price NUMERIC,
  highest_bid NUMERIC,
  highest_bidder_id UUID,
  status TEXT DEFAULT 'pending',
  seller_id UUID NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  product_link TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  integrations TEXT[],
  llm_type TEXT,
  llm_type_other TEXT,
  monthly_expenses JSONB DEFAULT '[]',
  product_age TEXT,
  number_of_employees TEXT,
  business_location TEXT,
  requires_nda BOOLEAN DEFAULT false,
  deliverables TEXT[] DEFAULT '{}',
  category_other TEXT,
  admin_feedback TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  submission_completed_at TIMESTAMP WITH TIME ZONE,
  payment_verified_at TIMESTAMP WITH TIME ZONE,
  is_revenue_verified BOOLEAN DEFAULT false,
  is_traffic_verified BOOLEAN DEFAULT false,
  is_code_audited BOOLEAN DEFAULT false,
  monetization TEXT,
  monetization_other TEXT,
  business_model TEXT,
  business_type TEXT,
  investment_timeline TEXT,
  auction_status TEXT DEFAULT 'pending',
  integrations_other TEXT,
  min_price NUMERIC,
  monthly_profit NUMERIC,
  gross_profit_margin NUMERIC,
  customer_acquisition_cost NUMERIC,
  monthly_churn_rate NUMERIC,
  nda_content TEXT,
  industry_other TEXT
);

-- Create price_history table
CREATE TABLE IF NOT EXISTS public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  price NUMERIC NOT NULL,
  type TEXT NOT NULL DEFAULT 'bid',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Everyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
DROP POLICY IF EXISTS "Everyone can view price history" ON public.price_history;
DROP POLICY IF EXISTS "System can insert price history" ON public.price_history;

-- Create RLS policies for products
CREATE POLICY "Everyone can view active products" ON public.products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can view their own products" ON public.products
  FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Users can insert their own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own products" ON public.products
  FOR UPDATE USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own products" ON public.products
  FOR DELETE USING (auth.uid() = seller_id);

-- Create RLS policies for price_history
CREATE POLICY "Everyone can view price history" ON public.price_history
  FOR SELECT USING (true);

CREATE POLICY "System can insert price history" ON public.price_history
  FOR INSERT WITH CHECK (true);

-- Create trigger for recording initial product price
DROP TRIGGER IF EXISTS trigger_record_initial_price ON public.products;
CREATE TRIGGER trigger_record_initial_price
  AFTER INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.record_initial_price();