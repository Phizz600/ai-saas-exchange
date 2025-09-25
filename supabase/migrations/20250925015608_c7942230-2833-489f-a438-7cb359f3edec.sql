-- Add foreign key constraint between products.seller_id and profiles.id
ALTER TABLE public.products 
ADD CONSTRAINT fk_products_seller_profile 
FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update some products to active status for testing the marketplace
-- Using a subquery to limit the update
UPDATE public.products 
SET status = 'active' 
WHERE status = 'pending' 
AND seller_id IS NOT NULL
AND id IN (
  SELECT id FROM products 
  WHERE status = 'pending' 
  AND seller_id IS NOT NULL 
  ORDER BY created_at DESC 
  LIMIT 3
);