-- Copyt Concierge - fixes public.pgmq_pop from 00008: pgmq.pop() actually
-- returns 6 columns (msg_id, read_ct, enqueued_at, vt, message, headers) but
-- the wrapper's RETURNS TABLE only declared 5, omitting `headers`. This threw
-- a type-mismatch error on every call, which the calling Edge Functions
-- silently swallowed as "no message available" - not a timing race, a real bug.

drop function public.pgmq_pop(text);

create function public.pgmq_pop(queue_name text)
returns table (msg_id bigint, read_ct integer, enqueued_at timestamptz, vt timestamptz, message jsonb, headers jsonb)
language plpgsql
security definer
set search_path = public, pgmq
as $$
begin
  return query select * from pgmq.pop(queue_name);
end;
$$;

grant execute on function public.pgmq_pop(text) to anon, authenticated, service_role;
