-- ═══════════════════════════════════════════════════════════
-- Setup pg_cron to trigger linkedin-cron-publish every minute
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
--
-- PREREQUISITES (do these in Dashboard BEFORE running this SQL):
--   1. Database → Extensions → Enable "pg_cron"
--   2. Database → Extensions → Enable "pg_net"
--
-- EXECUTE IN ORDER:
--   Step 1: Store secrets in Vault
--   Step 2: Schedule the cron job
-- ═══════════════════════════════════════════════════════════

-- ─── Step 1: Store secrets in Vault ───
-- Uses vault.create_secret() which is the correct API for Supabase Vault.
-- If these secrets already exist, you'll get a duplicate error — that's OK, skip this step.
--
-- ⚠️ REPLACE 'YOUR_SERVICE_ROLE_KEY_HERE' with your actual service_role key
-- Find it in: Dashboard → Settings → API → service_role (reveal)

SELECT vault.create_secret(
  'https://mvryaxohnbftupocdlqa.supabase.co',
  'project_url',
  'Supabase project URL for pg_cron HTTP calls'
);

SELECT vault.create_secret(
  'YOUR_SERVICE_ROLE_KEY_HERE',
  'service_role_key',
  'Service role key for Edge Function auth via pg_cron'
);


-- ─── Step 2: Schedule the cron job ───
-- Calls linkedin-cron-publish Edge Function every minute
-- Uses Vault to securely retrieve secrets at runtime

SELECT cron.schedule(
  'publish-scheduled-posts',
  '* * * * *',
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1)
           || '/functions/v1/linkedin-cron-publish',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1)
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);


-- ═══════════════════════════════════════════════════════════
-- VERIFICATION (run these AFTER the setup to confirm it works)
-- ═══════════════════════════════════════════════════════════

-- 1. Confirm cron job exists:
-- SELECT jobid, jobname, schedule FROM cron.job WHERE jobname = 'publish-scheduled-posts';

-- 2. Confirm secrets are stored (shows names only, not values):
-- SELECT name, description FROM vault.secrets WHERE name IN ('project_url', 'service_role_key');

-- 3. After 1-2 minutes, check execution history:
-- SELECT jobid, status, return_message, start_time
-- FROM cron.job_run_details
-- WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'publish-scheduled-posts')
-- ORDER BY start_time DESC LIMIT 5;

-- 4. Check HTTP responses from Edge Function:
-- SELECT id, status_code, created FROM net._http_response ORDER BY created DESC LIMIT 5;

-- 5. View pending scheduled posts:
-- SELECT id, post_type, status, scheduled_at FROM scheduled_posts WHERE status = 'pending' ORDER BY scheduled_at;

-- ═══════════════════════════════════════════════════════════
-- MANAGEMENT
-- ═══════════════════════════════════════════════════════════

-- To PAUSE the cron job:
-- UPDATE cron.job SET active = false WHERE jobname = 'publish-scheduled-posts';

-- To RESUME the cron job:
-- UPDATE cron.job SET active = true WHERE jobname = 'publish-scheduled-posts';

-- To REMOVE the cron job completely:
-- SELECT cron.unschedule('publish-scheduled-posts');
