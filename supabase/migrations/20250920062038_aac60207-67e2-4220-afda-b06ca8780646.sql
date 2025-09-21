-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
DROP POLICY IF EXISTS "Everyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
DROP POLICY IF EXISTS "Everyone can view price history" ON public.price_history;
DROP POLICY IF EXISTS "System can insert price history" ON public.price_history;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS record_initial_price_trigger ON public.products;

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  stage TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  listing_type TEXT NOT NULL DEFAULT 'fixed_price',
  auction_end_time TIMESTAMP WITH TIME ZONE,
  starting_price NUMERIC,
  reserve_price NUMERIC,
  current_price NUMERIC,
  highest_bid NUMERIC,
  highest_bidder_id UUID,
  no_reserve BOOLEAN DEFAULT false,
  min_price NUMERIC,
  price_decrement NUMERIC,
  price_decrement_interval TEXT DEFAULT 'minute',
  image_url TEXT,
  demo_url TEXT,
  product_link TEXT,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  industry TEXT,
  industry_other TEXT,
  business_model TEXT,
  monetization TEXT,
  monetization_other TEXT,
  monthly_revenue NUMERIC,
  monthly_profit NUMERIC,
  monthly_expenses JSONB DEFAULT '[]',
  gross_profit_margin NUMERIC,
  monthly_churn_rate NUMERIC,
  customer_acquisition_cost NUMERIC,
  monthly_traffic NUMERIC,
  active_users TEXT,
  team_size TEXT,
  number_of_employees TEXT,
  business_location TEXT,
  product_age TEXT,
  has_patents BOOLEAN DEFAULT false,
  investment_timeline TEXT,
  competitors TEXT,
  special_notes TEXT,
  requires_nda BOOLEAN DEFAULT false,
  nda_content TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_revenue_verified BOOLEAN DEFAULT false,
  is_traffic_verified BOOLEAN DEFAULT false,
  is_code_audited BOOLEAN DEFAULT false,
  business_type TEXT,
  deliverables TEXT[] DEFAULT '{}',
  integrations TEXT[],
  integrations_other TEXT,
  llm_type TEXT,
  llm_type_other TEXT,
  tech_stack_other TEXT,
  category_other TEXT,
  admin_feedback TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  payment_status TEXT DEFAULT 'pending',
  payment_verified_at TIMESTAMP WITH TIME ZONE,
  submission_completed_at TIMESTAMP WITH TIME ZONE,
  auction_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
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

-- Create RLS policies for products table
CREATE POLICY "Users can insert their own products" ON public.products
FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can view their own products" ON public.products
FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Everyone can view active products" ON public.products
FOR SELECT USING (status = 'active');

CREATE POLICY "Users can update their own products" ON public.products
FOR UPDATE USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own products" ON public.products
FOR DELETE USING (auth.uid() = seller_id);

-- Create RLS policies for price_history table
CREATE POLICY "Everyone can view price history" ON public.price_history
FOR SELECT USING (true);

CREATE POLICY "System can insert price history" ON public.price_history
FOR INSERT WITH CHECK (true);

-- Create trigger to record initial price when product is created
CREATE TRIGGER record_initial_price_trigger
  AFTER INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.record_initial_price();