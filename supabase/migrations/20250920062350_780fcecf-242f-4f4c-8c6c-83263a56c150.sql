-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS record_initial_price_trigger ON public.products;

-- Create the trigger to record initial price when product is created
CREATE TRIGGER record_initial_price_trigger
  AFTER INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.record_initial_price();