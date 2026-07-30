-- Copyt Concierge - Phase 9: background jobs (image-enhance, notify-status-
-- change, auth-score). See BUILD_PROMPTS.md Phase 9, SPEC.md §6.

-- auth_scores: stub ML authentication score per item. Real scoring is out of
-- scope for MVP (BUILD_PROMPTS.md is explicit about this) - this just gives
-- a human reviewer on /ops/authentication something to look at.
create table public.auth_scores (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items (id) on delete cascade,
  score numeric(5, 2) not null,
  model_version text not null default 'stub-v0',
  created_at timestamptz not null default now()
);

alter table public.auth_scores enable row level security;

create policy "auth_scores: staff only" on public.auth_scores
  for all using (public.is_staff()) with check (public.is_staff());

select pgmq.create('auth-score');

-- Extend the Phase 7 trigger function to pass the inserted row as JSON body,
-- so storage.objects inserts (Phase 9's image-enhance trigger) can tell the
-- Edge Function which object was uploaded. The three existing consumers
-- (webhook-ingest, delist-everywhere, notify-status-change) pop straight
-- from the queue table and ignore any request body, so this is additive.
create or replace function public.invoke_edge_function()
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
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || service_key),
    body := jsonb_build_object('record', row_to_json(new))
  );
  return new;
end;
$$;

-- Phase 7 created the notify-status-change queue but deliberately left this
-- trigger out ("consuming it is Phase 9's job" - 00007_queues.sql). Adding
-- it now that the consumer is real.
create trigger on_notify_status_change_insert
after insert on pgmq."q_notify-status-change"
for each row execute function public.invoke_edge_function('notify-status-change');

create trigger on_auth_score_insert
after insert on pgmq."q_auth-score"
for each row execute function public.invoke_edge_function('auth-score');

-- Database-Webhook-equivalent for Storage: fires when a new item photo lands
-- in the private 'item-photos' bucket (see 00004_storage.sql).
create trigger on_item_photo_upload
after insert on storage.objects
for each row
when (new.bucket_id = 'item-photos')
execute function public.invoke_edge_function('image-enhance');
