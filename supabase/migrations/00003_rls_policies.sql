-- Copyt Concierge - RLS policies, fulfilling the TODO left in 00001_init.sql.
-- Reviewed in Plan Mode per BUILD_PROMPTS.md Phase 5 before being written here.

-- Helper: is the current user staff or admin? security definer so it can read
-- profiles.role without being blocked by the RLS policy on profiles itself.
create function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff', 'admin')
  );
$$;

-- Standard Supabase pattern: create the matching profiles row whenever a new
-- auth.users row is inserted (covers password signup, magic link, and OAuth
-- alike). Role always starts as 'consignor' - staff/admin are promoted
-- manually, never via self-signup.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- profiles: a user manages their own row; staff/admin can see everyone
-- (needed for /admin/users and to resolve consignor names in ops queues).
create policy "profiles: select own" on public.profiles
  for select using (id = auth.uid());
create policy "profiles: select all for staff" on public.profiles
  for select using (public.is_staff());
create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid());

-- items: a consignor sees/creates only their own items; staff/admin see and
-- update everything (ops queues operate across all consignors).
create policy "items: select own" on public.items
  for select using (user_id = auth.uid());
create policy "items: insert own" on public.items
  for insert with check (user_id = auth.uid());
create policy "items: staff full access" on public.items
  for all using (public.is_staff()) with check (public.is_staff());

-- pipeline_events: consignor can see events for their own items; only staff
-- (or Edge Functions via the service role, which bypasses RLS) write events.
create policy "pipeline_events: select own items" on public.pipeline_events
  for select using (
    exists (select 1 from public.items where items.id = pipeline_events.item_id and items.user_id = auth.uid())
  );
create policy "pipeline_events: staff full access" on public.pipeline_events
  for all using (public.is_staff()) with check (public.is_staff());

-- listings: same shape as pipeline_events.
create policy "listings: select own items" on public.listings
  for select using (
    exists (select 1 from public.items where items.id = listings.item_id and items.user_id = auth.uid())
  );
create policy "listings: staff full access" on public.listings
  for all using (public.is_staff()) with check (public.is_staff());

-- sales: same shape.
create policy "sales: select own items" on public.sales
  for select using (
    exists (select 1 from public.items where items.id = sales.item_id and items.user_id = auth.uid())
  );
create policy "sales: staff full access" on public.sales
  for all using (public.is_staff()) with check (public.is_staff());

-- payouts: consignor sees their own payout history; staff/admin manage all
-- (batch payout runs in /ops/payouts, /admin territory).
create policy "payouts: select own" on public.payouts
  for select using (user_id = auth.uid());
create policy "payouts: staff full access" on public.payouts
  for all using (public.is_staff()) with check (public.is_staff());

-- platform_accounts, queue_job_log: internal-only, never consignor-visible.
create policy "platform_accounts: staff only" on public.platform_accounts
  for all using (public.is_staff()) with check (public.is_staff());
create policy "queue_job_log: staff only" on public.queue_job_log
  for all using (public.is_staff()) with check (public.is_staff());
