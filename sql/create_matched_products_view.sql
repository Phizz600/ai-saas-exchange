
-- Create a view for matched products with detailed information
CREATE OR REPLACE VIEW public.matched_products_view AS
SELECT 
  mp.product_id,
  mp.investor_id,
  mp.match_score,
  p.title,
  p.description,
  p.price,
  p.category,
  p.stage,
  p.image_url
FROM 
  matched_products mp
JOIN 
  products p ON mp.product_id = p.id
WHERE 
  p.status = 'active';

-- Refresh the matched_products materialized view with updated match scores
REFRESH MATERIALIZED VIEW CONCURRENTLY matched_products;
