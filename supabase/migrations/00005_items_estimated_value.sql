-- Copyt Concierge - adds a consignor-declared estimated value to items.
-- Surfaced in Phase 6: the portal needs some value to display for items that
-- aren't listed yet (listings.price only exists once actually listed). See
-- SPEC.md §5 - additive, nullable (an item's value can be genuinely unknown
-- before consignor input), no RLS changes needed since existing items policies
-- already cover this column.

alter table public.items add column estimated_value numeric(10, 2);
