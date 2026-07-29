# Copyt Concierge — Project Context (v2)

**What this is:** A managed "sell-it-for-me" resale service, built as an extension of
Copyt's existing cross-listing/inventory automation product. Consignors ship items in;
the platform authenticates, photographs, lists across StockX/eBay/Whatnot, sells,
delists everywhere instantly, and pays out. Full functional spec: see `SPEC.md`.
Brand reference: see `BRAND.md`.

## Stack (v2 — revised for budget: no AWS/GCP)

- **Single Next.js app** (App Router, TypeScript) — not separate web/admin apps.
  Marketing, consignor portal, and ops/admin all live in one app, separated by route
  groups and role-gated middleware:
  - `app/(marketing)/...` — public pages
  - `app/(portal)/...` — consignor-only, auth required
  - `app/(ops)/...` — staff/admin-only, auth + role required
- **Hosting**: Vercel (the Next.js app, including API routes as Vercel Functions)
- **Backend**: Supabase — Postgres, Auth, Storage (item photos), and:
  - **Queueing** → Supabase Queues (`pgmq` extension) instead of Redis/BullMQ
  - **Cron** → `pg_cron` (native Postgres scheduling in Supabase)
  - **Background/async jobs** → Supabase Edge Functions, invoked either by
    `pg_cron` (scheduled) or by Database Webhooks (event-triggered on table changes)
- **No separate worker service.** Edge Functions replace the old `apps/worker` —
  this removes an entire deployable from the v1 plan.
- **Payments**: Stripe Connect (unchanged)
- **Design system**: Tailwind, built on the Copyt brand tokens in `BRAND.md`

## Why this changed from v1

The original plan (AWS/GCP + Redis/BullMQ + separate worker service) assumed cloud
budget that isn't available. Supabase's `pgmq` + `pg_cron` + Edge Functions combo
covers all three required technical primitives (queue, cron, background jobs) natively
in Postgres, with zero extra infrastructure to run or pay for. Vercel + Supabase's free/
low tiers cover an MVP comfortably.

## Skills in use for this build

- `design-taste-frontend` ("Taste") — baseline design system, anti-generic-UI rules
- `emilkowalski/skill` (motion) — animation restraint and timing rules
- `pbakaus/impeccable` — design QA/polish passes (`/audit`, `/critique`, `/polish`)
- Anthropic's built-in `frontend-design` skill (Impeccable builds on this)
- Chrome DevTools MCP — lets Claude Code see rendered output and iterate visually

## Build order (non-negotiable — confirm before deviating)

1. Codebase + CLAUDE.md + skills + docs + plan (this phase)
2. **All frontend pages first** — static, brand-matched, no backend wiring yet
3. Supabase backend (schema, auth, storage)
4. Wire pages to real data, phase by phase (see SPEC.md §7, adapted for Supabase)
5. Queueing, cron, background jobs (pgmq / pg_cron / Edge Functions)
6. Payments, ops dashboard, polish pass

## Conventions

- Every queue job (pgmq) must be idempotent — this matters most for the
  cross-platform delisting logic.
- Never call a marketplace API (StockX/eBay/Whatnot) directly from client components —
  always through a server action or Route Handler.
- Run an Impeccable `/critique` pass at the end of every frontend phase before moving on.
- Use Plan Mode before starting a new phase; don't jump straight to code.

## Current phase

Phase 0 — foundation scaffold, skills, and docs (this commit).

## Do not

- Don't introduce Redis/BullMQ or a standalone worker — pgmq + pg_cron + Edge Functions
  cover it. If a real limitation is hit, write an ADR explaining why before adding
  infrastructure.
- Don't split into multiple Next.js apps — one app, role-gated routes.
- Don't wire any page to real data until the frontend-only phase is reviewed and approved.
