# Copyt Concierge

Managed resale-as-a-service, built on Copyt's cross-listing engine — ship it, we sell it.

Read in this order:

1. `CLAUDE.md` — architecture, stack, build order, conventions
2. `BRAND.md` — brand tokens extracted from Copyt's site
3. `SPEC.md` — full pages/features/data model/phase spec
4. `BUILD_PROMPTS.md` — the actual phase-by-phase Claude Code prompts

## Stack

- Next.js 15 (App Router, TypeScript), single app, route groups for
  marketing / consignor portal / ops+admin
- Hosting: Vercel
- Backend: Supabase — Postgres, Auth, Storage, Queues (pgmq), Cron (pg_cron),
  Edge Functions
- No Redis/BullMQ, no separate worker service, no AWS/GCP

## Local dev

```bash
pnpm install          # or npm/yarn
supabase start        # local Supabase stack (Postgres, Auth, Storage, Studio)
pnpm dev               # Next.js dev server
```

## Structure

- `app/(marketing)` — public pages
- `app/(portal)` — consignor portal (auth required)
- `app/(ops)` — staff/admin dashboard (auth + role required)
- `app/api/webhooks/[platform]` — webhook ingestion (enqueues to pgmq, never
  processes synchronously)
- `lib/supabase` — client/server Supabase helpers
- `lib/queue-names.ts` — shared pgmq queue names + pg_cron job names
- `supabase/migrations` — schema + cron template
- `supabase/functions` — Edge Function queue consumers
