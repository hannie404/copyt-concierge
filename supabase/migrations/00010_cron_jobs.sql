-- Copyt Concierge - Phase 8: pg_cron scheduled jobs. Supersedes the
-- commented-out cron.schedule template in 00002_cron.sql (that file's own
-- note said the real calls belong in a later reviewed migration - this is it).
-- Reuses the Vault secrets Phase 7 already created
-- (edge_function_project_url, edge_function_service_key).

-- Plain (non-trigger) counterpart to 00007_queues.sql's invoke_edge_function()
-- trigger function, callable from cron.schedule bodies.
create function public.call_edge_function(function_name text)
returns void
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
    url := project_url || '/functions/v1/' || function_name,
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || service_key)
  );
end;
$$;

select cron.schedule(
  'nightly-reprice',
  '0 2 * * *',
  $$ select public.call_edge_function('nightly-reprice') $$
);

select cron.schedule(
  'weekly-payout-batch',
  '0 9 * * 1',
  $$ select public.call_edge_function('weekly-payout-batch') $$
);

select cron.schedule(
  'daily-reconciliation',
  '0 3 * * *',
  $$ select public.call_edge_function('daily-reconciliation') $$
);

select cron.schedule(
  'sla-breach-check',
  '0 * * * *',
  $$ select public.call_edge_function('sla-breach-check') $$
);
