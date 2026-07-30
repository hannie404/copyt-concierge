# Copyt Concierge

A managed "sell-it-for-me" resale service — consignors ship an item in, the platform
authenticates it, photographs it, lists it across StockX, eBay, and Whatnot
simultaneously, and the moment it sells on any one of them, delists it everywhere
else within seconds. Consignors get paid out on a schedule; staff run the pipeline
through an internal ops dashboard.

<img width="1441" height="940" alt="image" src="https://github.com/user-attachments/assets/27fdb88e-66ff-487d-b6ba-5f88a102e953" />

## Why this project

The brief asked me to surprise you rather than build something prescribed, so I chose
a system built on top of Copyt's own product surface — cross-listing and inventory
automation for resellers — rather than a generic CRUD app. I wanted to build
something where queueing, cron, and background jobs aren't decorative requirements
bolted onto an unrelated idea, but the actual load-bearing spine of a business model:
a consignment pipeline lives or dies on whether "delist everywhere the instant it
sells" happens reliably and fast, whether nightly repricing actually runs, and
whether a missed webhook gets caught by a reconciliation sweep before a customer
notices. I wanted this assessment to demonstrate not just that I can wire up a queue,
but that I can reason about *when* something should be a queue job versus a cron job
versus a background task, and why — which is the actual skill this exercise is
testing for.

## Architecture

```
Vercel (Next.js app, single deployment)
  ├─ app/(marketing)  — public site
  ├─ app/(portal)     — consignor dashboard, auth required
  ├─ app/(ops)        — internal staff/admin dashboard, auth + role required
  └─ app/api/webhooks/[platform] — verifies + enqueues, never processes inline

Supabase
  ├─ Postgres          — source of truth (schema below)
  ├─ Auth              — consignor + staff accounts, role-based access
  ├─ Storage           — item photos
  ├─ Queues (pgmq)     — webhook-ingest, delist-everywhere, publish-listing,
  │                      notify-status-change
  ├─ pg_cron           — nightly-reprice, weekly-payout-batch,
  │                      daily-reconciliation, sla-breach-check
  └─ Edge Functions    — the actual workers: pop a queue message or get invoked
                         on a schedule, do the work, write back to Postgres
```

One Next.js app, not a services-per-team split — a consignor portal and an internal
ops tool don't need separate deployments, just separate route groups with different
auth requirements. Everything backend-side runs on Supabase rather than a
self-managed queue/worker stack; see **Design decisions** below for why.

### Data model

`profiles` (extends `auth.users`) → `items` → `pipeline_events` (audit trail of every
status change) → `listings` (one row per platform an item is published to) → `sales`
→ `payouts`. Plus `platform_accounts` (per-platform credentials/rate-limit state) and
`queue_job_log` (every queue/cron run, for observability).

### The three required concepts, and where to find them

| Requirement | Implementation | Where |
|---|---|---|
| **Queueing** | Supabase Queues (`pgmq`) — 4 named queues, each consumed by a dedicated Edge Function | `supabase/functions/*`, enqueue calls in `app/api/webhooks/[platform]/route.ts` |
| **Cron / scheduled tasks** | `pg_cron` + `pg_net`, calling Edge Function HTTP endpoints on a schedule | `supabase/migrations/00002_cron.sql` |
| **Background / async processing** | Edge Functions do all the actual work — queue consumers and cron targets alike — off the request path | `supabase/functions/webhook-ingest`, `delist-everywhere`, `notify-status-change` |

The one worth reading closely is `delist-everywhere`: it's the trust-critical path
(an item selling on StockX must delist the eBay and Whatnot copies within seconds, or
you risk a double-sale) and it's written to be idempotent — replaying the same queue
message twice doesn't double-delist or double-notify, because it only acts on
listings still marked `active`.

## Design decisions & trade-offs

**Supabase (pgmq + pg_cron + Edge Functions) instead of Redis/BullMQ + a worker
service.** I started this project assuming a self-hosted queue and a standalone
worker process — the conventional choice. I switched once budget constraints ruled
out AWS/GCP: Postgres-native queueing and scheduling cover the same three
requirements with zero extra infrastructure to run or monitor. The trade-off is
throughput ceiling and ecosystem maturity — `pgmq` is younger and less battle-tested
than Redis-backed queues at high volume — but for this system's actual load (a
resale pipeline, not a high-frequency trading system), that ceiling is nowhere near
a real constraint, and "one less service to run" was worth more than headroom I
don't need yet.

**One app, not a services split.** Consignor-facing and staff-facing surfaces live in
the same Next.js app, gated by route group and middleware rather than separate
deployments. Simpler to run, and there's no actual scaling or security reason to
split them at this size — I'd revisit that only if the ops team grew large enough to
need an independent release cadence.

**Mock platform adapters instead of real StockX/eBay/Whatnot API keys.** I don't have
production credentials for any of these marketplaces, and I didn't want that to mean
the demo can't show the interesting part. Every platform interaction goes through a
`PlatformAdapter` interface with a real implementation and a mock one; the mock
returns realistic fake data instantly. This means the queue/cron/background-job code
paths — including the delist-everywhere logic — are exercised exactly as they would
be in production, just against fake responses instead of live API calls. See
**Running & testing** for how this plays out in a live demo.

**RLS over application-level auth checks.** Postgres row-level security policies
scope every table (a consignor can only see their own items; staff see all), rather
than filtering in application code. More setup cost up front, meaningfully less risk
of an application bug leaking another consignor's data.

## Assumptions

- Real marketplace credentials (StockX/eBay/Whatnot) aren't available for this
  assessment, and the mock-adapter design is the intended way to demonstrate the
  system rather than a workaround I'd ship to production as-is.
- Consignor and staff accounts share one `profiles` table distinguished by a `role`
  column, rather than fully separate tables — reasonable at this scale, worth
  revisiting if staff accounts need meaningfully different data.
- Payment is scoped to Stripe Connect in test mode; no real payouts occur.
- Image "enhancement" and ML-based authentication scoring are stubbed rather than
  fully implemented — they're real queue/background-job wiring with a placeholder
  where a production model or image-processing call would go. The assessment is
  about the system design, not shipping a computer vision model.

## Setup

```bash
git clone <this-repo>
cd copyt-concierge
pnpm install          # or npm install / yarn

npx supabase init     # if not already initialized
npx supabase start    # local Postgres, Auth, Storage, Studio via Supabase CLI

cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY /
# SUPABASE_SERVICE_ROLE_KEY from `supabase status` output.
# Leave STOCKX_API_KEY / EBAY_API_KEY / WHATNOT_API_KEY empty — see below.

npx supabase db push  # applies supabase/migrations/*
pnpm dev
```

Open `http://localhost:3000`.

## Running the end-to-end demo

With no marketplace API keys set, every platform runs against the mock adapter
automatically — nothing extra to configure.

1. Run the seed script (`supabase/seed.sql`, or `pnpm run seed` if you prefer a
   scripted version) to populate a handful of items across different pipeline
   stages, so the dashboard isn't empty on first load.
2. Sign up as a consignor, or use a seeded test account, and open `/dashboard`.
3. Open an item that's listed on all three (mocked) platforms.
4. Click **Simulate Sale** — visible only when the mock adapter is active. This
   fires the exact code path a real marketplace webhook would: inserts a `sales`
   row, enqueues `webhook-ingest`, and lets `delist-everywhere` run for real.
5. Refresh — the other two listings should now show as delisted, and a
   `queue_job_log` row will show the job ran. Check `/admin/integrations` to see
   which adapter (mock vs. real) is active per platform.
6. `/ops/*` pages show the same pipeline from the staff side — intake, authentication,
   photography, listing, sold, exceptions, payouts.

To test the cron jobs without waiting for their real schedule, invoke the relevant
Edge Function directly (`npx supabase functions invoke nightly-reprice`, etc.) —
`pg_cron`'s job is just to call that same endpoint on a timer.

## Testing

- `pnpm test` runs unit tests, with the idempotency logic in `delist-everywhere`
  specifically covered (replaying a message with listings already marked `delisted`
  should be a no-op).
- Manual/E2E verification is via the demo flow above rather than a full E2E suite —
  a deliberate scope call given the assessment's emphasis on design and communication
  over feature completeness; happy to walk through what a fuller test strategy would
  look like.

## What's intentionally out of scope

- Real marketplace API integrations (mocked, per **Assumptions**)
- ML-based authentication scoring and image enhancement (stubbed)
- Production-grade observability/alerting beyond `queue_job_log`
- A fully built-out design system beyond the core flows shown in the demo

