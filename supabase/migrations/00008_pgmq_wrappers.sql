-- Copyt Concierge - Phase 7 fix: the codebase's Route Handler and Edge
-- Functions were written against a `pgmq_public` wrapper schema, assuming the
-- Supabase Dashboard's "Enable Queues" toggle had created it. It hadn't - only
-- the `pgmq` extension was enabled directly via SQL, and `pgmq_public` never
-- existed. Exposing that nonexistent schema to PostgREST (attempted via the
-- Management API) broke schema-cache introspection for the *entire* REST API
-- project-wide and was immediately reverted.
--
-- Fix: thin wrapper RPCs in the already-PostgREST-exposed `public` schema, so
-- no further PostgREST config changes (and no repeat of that outage risk) are
-- needed. `security definer` so callers only need execute grants, not direct
-- access to the `pgmq` schema.

create function public.pgmq_send(queue_name text, message jsonb)
returns bigint
language plpgsql
security definer
set search_path = public, pgmq
as $$
begin
  return (select pgmq.send(queue_name, message));
end;
$$;

create function public.pgmq_pop(queue_name text)
returns table (msg_id bigint, read_ct integer, enqueued_at timestamptz, vt timestamptz, message jsonb)
language plpgsql
security definer
set search_path = public, pgmq
as $$
begin
  return query select * from pgmq.pop(queue_name);
end;
$$;

grant execute on function public.pgmq_send(text, jsonb) to anon, authenticated, service_role;
grant execute on function public.pgmq_pop(text) to anon, authenticated, service_role;
