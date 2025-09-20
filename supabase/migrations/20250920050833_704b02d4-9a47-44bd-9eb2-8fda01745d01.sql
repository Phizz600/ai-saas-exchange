-- Add SELECT policy for products table to allow everyone to view active products
CREATE POLICY "Everyone can view active products" 
ON public.products 
FOR SELECT 
USING (status = 'active');

-- Add SELECT policy for users to view their own products regardless of status
CREATE POLICY "Users can view their own products" 
ON public.products 
FOR SELECT 
USING (auth.uid() = seller_id);