-- Drop all problematic triggers and functions that reference auction fields
DROP TRIGGER IF EXISTS validate_pricing_trigger ON products;
DROP FUNCTION IF EXISTS public.validate_product_pricing() CASCADE;

-- Drop and recreate set_product_listing_type
DROP FUNCTION IF EXISTS public.set_product_listing_type() CASCADE;

-- Recreate the simplified listing type function (no auctions in DFaaS)
CREATE FUNCTION public.set_product_listing_type()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  -- Always fixed_price for DFaaS
  NEW.listing_type := 'fixed_price';
  RETURN NEW;
END;
$function$;

-- Recreate the trigger for listing type
CREATE TRIGGER set_listing_type_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_product_listing_type();

-- Simplified pricing validation (no auctions)
CREATE FUNCTION public.validate_product_pricing()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  -- Only validate fixed price for DFaaS
  IF NEW.price IS NULL OR NEW.price <= 0 THEN
    RAISE EXCEPTION 'Fixed price listings must have a positive price';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Recreate pricing validation trigger
CREATE TRIGGER validate_pricing_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_product_pricing();

-- Update existing NULL values with defaults
UPDATE products 
SET 
  product_link = COALESCE(product_link, ''),
  image_url = COALESCE(image_url, ''),
  monetization = COALESCE(monetization, 'subscription'),
  stage = COALESCE(stage, 'MVP'),
  key_features = COALESCE(key_features, '')
WHERE product_link IS NULL 
  OR image_url IS NULL 
  OR monetization IS NULL 
  OR stage IS NULL 
  OR key_features IS NULL;

-- Now set NOT NULL constraints
ALTER TABLE products 
  ALTER COLUMN product_link SET NOT NULL,
  ALTER COLUMN image_url SET NOT NULL,
  ALTER COLUMN monetization SET NOT NULL,
  ALTER COLUMN stage SET NOT NULL,
  ALTER COLUMN key_features SET NOT NULL;