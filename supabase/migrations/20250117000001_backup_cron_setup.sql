-- Optional: Setup pg_cron for automatic weekly backups
-- This requires the pg_cron extension to be enabled in your Supabase project
-- Note: pg_cron is only available on Pro plans and above

-- Enable pg_cron extension (if available)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule weekly backup every Monday at 2:00 AM UTC
-- Uncomment the line below if pg_cron is available in your Supabase project
-- SELECT cron.schedule(
--   'weekly-backup',
--   '0 2 * * 1', -- Every Monday at 2:00 AM UTC
--   $$SELECT public.create_weekly_backup()$$
-- );

-- To check if pg_cron is available:
-- SELECT * FROM pg_available_extensions WHERE name = 'pg_cron';

-- To list scheduled jobs:
-- SELECT * FROM cron.job;

-- To remove the scheduled job:
-- SELECT cron.unschedule('weekly-backup');

-- Alternative: Use an external cron service (cron-job.org, EasyCron, etc.)
-- to call the Edge Function: https://[project].supabase.co/functions/v1/weekly-backup
-- with header: X-Backup-Secret: [your-secret]






