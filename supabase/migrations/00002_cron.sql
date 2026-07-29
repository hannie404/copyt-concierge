-- Copyt Concierge - scheduled jobs via pg_cron + pg_net, calling Edge Functions.
-- Schedule expressions match SPEC.md §6 / BUILD_PROMPTS.md Phase 8.
-- Store project_url and the function auth token in Supabase Vault rather than
-- hardcoding them here - see Supabase's "Scheduling Edge Functions" docs.
-- This file is a template: the actual `select cron.schedule(...)` calls are
-- meant to be reviewed together (Phase 8 asks to see the expressions before
-- applying), so they're commented out until that review happens.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- select cron.schedule(
--   'nightly-reprice',
--   '0 2 * * *', -- 2am daily
--   $$ select net.http_post(url := (select decrypted_secret from vault.decrypted_secrets where name = 'nightly_reprice_fn_url')) $$
-- );

-- select cron.schedule(
--   'weekly-payout-batch',
--   '0 9 * * 1', -- Monday 9am
--   $$ select net.http_post(url := (select decrypted_secret from vault.decrypted_secrets where name = 'weekly_payout_batch_fn_url')) $$
-- );

-- select cron.schedule(
--   'daily-reconciliation',
--   '0 3 * * *', -- 3am daily
--   $$ select net.http_post(url := (select decrypted_secret from vault.decrypted_secrets where name = 'daily_reconciliation_fn_url')) $$
-- );

-- select cron.schedule(
--   'sla-breach-check',
--   '0 * * * *', -- hourly
--   $$ select net.http_post(url := (select decrypted_secret from vault.decrypted_secrets where name = 'sla_breach_check_fn_url')) $$
-- );
