-- Security Fix: Restrict Bid Visibility to Prevent Competitor Intelligence Theft
-- Remove overly permissive policies that allow public access to bid data

-- Drop policies that allow anyone to view all bids (SECURITY RISK)
DROP POLICY IF EXISTS "Bids are viewable by everyone" ON public.bids;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.bids;
DROP POLICY IF EXISTS "Enable read access to bids" ON public.bids;

-- Clean up redundant INSERT policies - keep only the most restrictive ones
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.bids;
DROP POLICY IF EXISTS "Enable insert for authenticated" ON public.bids;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.bids;
DROP POLICY IF EXISTS "Users can insert bids" ON public.bids;

-- Keep only secure policies that restrict access appropriately:
-- 1. "Enable read access for bid participants" - allows bidder OR product seller to see bids
-- 2. "Sellers can view bids on their products" - allows sellers to see bids on their products  
-- 3. "Users can view their own bids" - allows users to see their own bids
-- 4. "Enable insert for authenticated users" - allows authenticated users to bid with proper checks

-- Ensure we have the secure INSERT policy (create if doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bids' 
    AND policyname = 'Enable insert for authenticated users'
    AND cmd = 'INSERT'
  ) THEN
    CREATE POLICY "Enable insert for authenticated users" ON public.bids
    FOR INSERT TO authenticated
    WITH CHECK (
      (auth.uid() = bidder_id) AND 
      (EXISTS (
        SELECT 1 FROM products 
        WHERE id = bids.product_id 
        AND status = 'active'
      ))
    );
  END IF;
END $$;

-- Add a comment explaining the security model
COMMENT ON TABLE public.bids IS 'Bid data is restricted to bidders and product sellers only to prevent competitor intelligence theft';

-- Log this security change (use NULL for system operations)
INSERT INTO public.admin_activity_log (admin_id, action, details)
VALUES (
  NULL,
  'security_fix_bid_visibility',
  jsonb_build_object(
    'description', 'Removed public read access to bids table to prevent competitor intelligence theft',
    'policies_removed', ARRAY['Bids are viewable by everyone', 'Enable read access for authenticated users', 'Enable read access to bids'],
    'security_impact', 'HIGH - Prevents unauthorized access to sensitive bidding data',
    'timestamp', NOW()
  )
);