-- Copyt Concierge - Phase 7: pgmq queues + Database-Webhook-equivalent
-- invocation for the two Edge Functions this phase wires (webhook-ingest,
-- delist-everywhere). notify-status-change's queue is created so existing
-- `send` calls succeed, but intentionally has no trigger - consuming it is
-- Phase 9's job. See SPEC.md §6, CLAUDE.md's queue/cron/background-job rule.

select pgmq.create('webhook-ingest');
select pgmq.create('delist-everywhere');
select pgmq.create('notify-status-change');

-- Vault secrets 'edge_function_project_url' / 'edge_function_service_key' are
-- created separately via `supabase db query` (not in this file) - `supabase
-- db push` has no variable-substitution mechanism, so a real secret value
-- can't safely live in a committed migration. See docs/PLAN.md Phase 7.

-- Generic Database-Webhook-equivalent trigger: fires on insert into a pgmq
-- queue table, invokes the named deployed Edge Function so the message gets
-- consumed near-real-time instead of waiting on a poll. TG_ARGV[0] is the
-- Edge Function name, passed at CREATE TRIGGER time per queue.
create function public.invoke_edge_function()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  project_url text;
  service_key text;
begin
  select decrypted_secret into project_url from vault.decrypted_secrets where name = 'edge_function_project_url';
  select decrypted_secret into service_key from vault.decrypted_secrets where name = 'edge_function_service_key';

  perform net.http_post(
    url := project_url || '/functions/v1/' || TG_ARGV[0],
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || service_key)
  );
  return new;
end;
$$;

create trigger on_webhook_ingest_insert
after insert on pgmq."q_webhook-ingest"
for each row execute function public.invoke_edge_function('webhook-ingest');

create trigger on_delist_everywhere_insert
after insert on pgmq."q_delist-everywhere"
for each row execute function public.invoke_edge_function('delist-everywhere');
