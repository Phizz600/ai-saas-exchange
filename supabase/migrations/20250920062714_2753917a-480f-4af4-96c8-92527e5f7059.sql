-- Drop and recreate the trigger function with explicit schema and search path
DROP FUNCTION IF EXISTS public.record_initial_price() CASCADE;

CREATE OR REPLACE FUNCTION public.record_initial_price()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.price_history (product_id, price, type)
  VALUES (NEW.id, NEW.price, 'listing');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate the trigger
CREATE TRIGGER record_initial_price_trigger
  AFTER INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.record_initial_price();