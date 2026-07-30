-- Copyt Concierge - Storage bucket for item photos. Private bucket, path-scoped
-- access: objects live under `{user_id}/{item_id}/...`. Consignors can only
-- reach their own item's folder; staff/admin (ops photography/authentication
-- queues) can reach everything.

insert into storage.buckets (id, name, public)
values ('item-photos', 'item-photos', false);

create policy "item-photos: consignor read own" on storage.objects
  for select using (
    bucket_id = 'item-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "item-photos: consignor upload own" on storage.objects
  for insert with check (
    bucket_id = 'item-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "item-photos: staff full access" on storage.objects
  for all using (
    bucket_id = 'item-photos' and public.is_staff()
  ) with check (
    bucket_id = 'item-photos' and public.is_staff()
  );
