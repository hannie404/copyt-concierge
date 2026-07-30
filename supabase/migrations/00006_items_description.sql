-- Copyt Concierge - adds a human-readable item description. Surfaced while
-- wiring /intake/new in Phase 6: items had no name/description column, but
-- every portal page (dashboard, items list, item detail) displays one - a SKU
-- alone isn't identifiable to a consignor. Additive, not null with a default
-- so existing rows (none yet in this fresh project) stay valid.

alter table public.items add column description text not null default '';
