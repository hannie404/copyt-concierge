# Supabase — Copyt Concierge

- `migrations/00001_init.sql` — core schema (profiles, items, pipeline_events,
  listings, sales, payouts, platform_accounts, queue_job_log). RLS is enabled
  per-table but policies are intentionally not written here — see
  BUILD_PROMPTS.md Phase 5 (walk through them in Plan Mode first).
- `migrations/00002_cron.sql` — pg_cron schedule template (commented out until
  Phase 8's review).
- `functions/` — Edge Functions for the queue consumers (webhook-ingest,
  delist-everywhere, notify-status-change). Each pops from its pgmq queue and
  processes one message per invocation; trigger them either on a schedule
  (pg_cron calling the function URL) or via Database Webhooks.

## Before Phase 5

Enable the **Queues** and **Cron** integrations from the Supabase dashboard's
integrations page — they're opt-in add-ons on a fresh project, not on by default.

## Local dev

`supabase init` (if not already done) then `supabase start` brings up the full
local stack (Postgres, Auth, Storage, Studio) via the Supabase CLI — no
docker-compose.yml needed, the CLI manages its own containers.
