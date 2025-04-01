
-- Drop the old update_dutch_auction_prices function
DROP FUNCTION IF EXISTS public.update_dutch_auction_prices();

-- Create an improved function that doesn't update prices directly
-- This function will now just be used as a cron job trigger for the Edge Function
CREATE OR REPLACE FUNCTION public.update_dutch_auction_prices()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Log that the function was triggered (this will show up in Supabase logs)
  RAISE NOTICE 'Dutch auction price update triggered - processing moved to Edge Function';
  
  -- The actual price update logic is moved to the Edge Function
  -- This function is now just a placeholder for the cron job
END;
$function$;

-- Make sure we have a cron job set to call the Edge Function directly
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_catalog.pg_proc WHERE proname = 'cron_job_exists'
  ) THEN
    IF NOT cron_job_exists('update_dutch_auction_prices_edge') THEN
      PERFORM cron.schedule(
        'update_dutch_auction_prices_edge',
        '*/10 * * * *',  -- Run every 10 minutes
        $$
        SELECT
          net.http_post(
            url:='https://pxadbwlidclnfoodjtpd.supabase.co/functions/v1/update-dutch-auction-prices',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc3ODksImV4cCI6MjA1MjkzMzc4OX0.CmmgdPEsVLlbmz0W3dqox505pVMO8lqxFlul2yp84i0"}'::jsonb,
            body:='{}'::jsonb
          ) as request_id;
        $$
      );
    ELSE
      -- Update the existing cron job
      PERFORM cron.alter_job(
        'update_dutch_auction_prices_edge',
        schedule:='*/10 * * * *'  -- Run every 10 minutes
      );
    END IF;
  END IF;
END$$;

-- Add comment to explain the changes
COMMENT ON FUNCTION public.update_dutch_auction_prices() IS 'This function now serves as a proxy to trigger the Edge Function that handles the actual Dutch auction price updates based on the specified decrement intervals.';
