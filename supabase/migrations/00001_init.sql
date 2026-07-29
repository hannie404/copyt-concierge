-- Copyt Concierge - initial schema. Mirrors SPEC.md §5, adapted to Postgres/
-- Supabase conventions (snake_case, auth.users instead of a custom User table).
-- RLS policies are intentionally left as TODOs - Phase 5 in BUILD_PROMPTS.md
-- calls for walking through them in Plan Mode before applying, rather than
-- generating them silently here.

create extension if not exists pgcrypto;

-- Profile row for every authenticated user (consignor or staff). id mirrors
-- auth.users.id. role distinguishes consignors from staff/admin for the
-- (ops) route group's access checks.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'consignor' check (role in ('consignor', 'staff', 'admin')),
  name text,
  payout_method_id text,
  created_at timestamptz not null default now()
);

create type item_status as enum (
  'received', 'authenticating', 'flagged', 'photographed', 'listed', 'sold', 'paid'
);

create type platform as enum ('stockx', 'ebay', 'whatnot', 'pos');

create table public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  sku text not null,
  barcode text not null unique,
  status item_status not null default 'received',
  intake_at timestamptz not null default now(),
  authenticated_at timestamptz
);

create table public.pipeline_events (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items (id) on delete cascade,
  from_status text not null,
  to_status text not null,
  actor text not null, -- 'system' or a staff profile id as text
  created_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items (id) on delete cascade,
  platform platform not null,
  external_id text,
  price numeric(10, 2) not null,
  status text not null default 'active' check (status in ('active', 'delisted', 'sold')),
  last_synced_at timestamptz not null default now()
);

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items (id),
  listing_id uuid not null references public.listings (id),
  platform platform not null,
  sale_price numeric(10, 2) not null,
  sold_at timestamptz not null default now()
);

create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  amount numeric(10, 2) not null,
  batch_id text not null,
  status text not null default 'pending',
  paid_at timestamptz
);

create table public.platform_accounts (
  id uuid primary key default gen_random_uuid(),
  platform platform not null,
  credentials_ref text not null,
  rate_limit_state jsonb
);

create table public.queue_job_log (
  id uuid primary key default gen_random_uuid(),
  queue_name text not null,
  job_type text not null,
  item_id uuid references public.items (id),
  status text not null,
  attempts int not null default 0,
  error text,
  created_at timestamptz not null default now()
);

-- Enable RLS on every table. Policies are written in Phase 5 (BUILD_PROMPTS.md)
-- after walking through them together - do not assume defaults here.
alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.pipeline_events enable row level security;
alter table public.listings enable row level security;
alter table public.sales enable row level security;
alter table public.payouts enable row level security;
alter table public.platform_accounts enable row level security;
alter table public.queue_job_log enable row level security;
