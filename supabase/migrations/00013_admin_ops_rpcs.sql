-- Copyt Concierge - Phase 11: staff-only RPCs exposing pgmq/cron health to
-- /admin/integrations. Neither the pgmq nor cron schema is exposed to
-- PostgREST directly, so these wrap the relevant introspection functions/
-- tables the same way public.is_staff() wraps profiles. See BUILD_PROMPTS.md
-- Phase 11 item 3, docs/PLAN.md.

create or replace function public.get_queue_depths()
returns table (queue_name text, queue_length bigint)
language sql
security definer
set search_path = public
stable
as $$
  select m.queue_name, m.queue_length
  from pgmq.metrics_all() m
  where public.is_staff()
    and m.queue_name in ('webhook-ingest', 'delist-everywhere', 'notify-status-change', 'auth-score');
$$;

create or replace function public.get_cron_jobs()
returns table (jobname text, schedule text, active boolean)
language sql
security definer
set search_path = public
stable
as $$
  select j.jobname, j.schedule, j.active
  from cron.job j
  where public.is_staff();
$$;
