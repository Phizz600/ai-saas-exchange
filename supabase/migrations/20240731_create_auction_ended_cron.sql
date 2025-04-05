
-- Enable the pg_cron and pg_net extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Drop existing job if it exists
SELECT cron.unschedule('check-ended-auctions-job');

-- Create cron job to run every 15 minutes
SELECT cron.schedule(
  'check-ended-auctions-job',
  '*/15 * * * *',  -- Run every 15 minutes
  $$
  SELECT
    net.http_post(
      url:='https://pxadbwlidclnfoodjtpd.supabase.co/functions/v1/check-ended-auctions',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc3ODksImV4cCI6MjA1MjkzMzc4OX0.CmmgdPEsVLlbmz0W3dqox505pVMO8lqxFlul2yp84i0"}'::jsonb,
      body:='{"timestamp": "' || now() || '"}'::jsonb
    ) as request_id;
  $$
);

-- Add comment on the job
COMMENT ON PROCEDURE cron.job_run_details(bigint) IS 'This cron job checks for auctions that have ended and triggers email notifications';
