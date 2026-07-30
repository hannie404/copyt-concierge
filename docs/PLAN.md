# Copyt Concierge — Build Plan / Checklist

Restates the build order from `CLAUDE.md` so we have a running checklist to check off
together. Do not deviate from this order without flagging it first (see CLAUDE.md
"Build order (non-negotiable — confirm before deviating)").

## Phase 0 — Codebase + CLAUDE.md + skills + docs + plan

- [x] Repo scaffold: Next.js 15 (App Router, TypeScript)
- [x] Tailwind CSS configured (`tailwind.config.ts`, `postcss.config.js`, `app/globals.css`)
- [x] Route groups: `app/(marketing)`, `app/(portal)`, `app/(ops)`
- [x] `supabase/` directory structure (`migrations/`, `functions/`, `README.md`)
- [x] ESLint configured (`eslint.config.mjs`, flat config + `eslint-config-next` + `eslint-config-prettier`)
- [x] Prettier configured (`.prettierrc.json`, `.prettierignore`)
- [x] CI-friendly `package.json` (`lint`, `typecheck`, `format`, `format:check`, `build` scripts)
- [x] Placeholder "coming soon" routes proving each route group (covers full SPEC.md
      route inventory, not just one page per group)
- [x] `docs/PLAN.md` (this file)
- [x] Skills confirmed loaded: `design-taste-frontend`, emilkowalski skill set
      (`emil-design-eng`, `animation-vocabulary`, `apple-design`,
      `find-animation-opportunities`, `improve-animations`, `pick-ui-library`,
      `prototype`, `review-animations`), `impeccable`
- [x] Chrome DevTools MCP tools available
- [x] Verified end-to-end: `npm install`, `lint`, `typecheck`, `build`, `format:check` all pass

## Phase 1 — Design system & brand foundation

- [x] Lock design tokens against BRAND.md + 3 Copyt screenshots (impeccable `document`
      workflow) — `DESIGN.md` + `.impeccable/design.json` written; North Star "The
      Consignment Vault"; hex values are visual estimates, not pixel-sampled (flagged
      in DESIGN.md)
- [x] Tailwind theme tokens: color (incl. `status.*` pipeline colors), typography
      (Archivo display / Inter body via `next/font`), radii (`full` + `card`)
- [x] Base component library: Button, Pill nav item, Card, StatBlock, Section wrapper,
      glass-card overlay, plus Status Pill (signature component, not in original list —
      added because SPEC.md's item status tracker needed it)
- [x] Temporary component gallery page (`app/(marketing)/dev/components`)
- [x] Visual confirmation via Chrome DevTools MCP screenshot
- [x] Impeccable `/critique` pass on the gallery page — dual-agent run, 18/24 (75%,
      Good). Found + fixed: status-pill 3-way color collision (P0), primary button
      WCAG AA contrast failure 4.3:1→4.87:1 (P0), untokenized `flagged` color (P1),
      stat-block divider spec drift (P2), missing `focus-visible` ring (P2). Report
      archived at `.impeccable/critique/2026-07-29T22-42-24Z__app-marketing-dev-components-page-tsx.md`
- [x] Verified end-to-end after fixes: `lint`, `typecheck`, `build` all pass;
      contrast re-measured live in-browser (4.87:1)

## Phase 2 — Marketing site pages (frontend only, static)

- [x] Built all 7 marketing pages from SPEC.md §2 on the Phase 1 design system:
      `/`, `/how-it-works`, `/pricing`, `/trust-authentication`, `/faq`, `/login`,
      `/signup`. Added shared `Nav`/`Footer` components + `app/(marketing)/layout.tsx`.
      Login/signup use the reference screenshots' split-panel pattern (dark left panel,
      white form panel).
- [x] No backend, no real auth — static content only, forms are non-functional

## Phase 3 — Consignor portal pages (frontend only, static)

- [x] Portal pages built: `/dashboard`, `/intake/new`, `/items`, `/items/[id]`,
      `/payouts`, `/settings`. Added `PortalShell` (sidebar nav + top bar) +
      `app/(portal)/layout.tsx`. `/items/[id]` implements the horizontal status
      tracker (Received→...→Paid) from DESIGN.md's Status Pill component.
- [x] Static/mocked data — `lib/mock-data.ts`, typed against `ItemStatus`/`Platform`
      from `lib/queue-names.ts` so Phase 6 wiring is a drop-in swap

## Phase 4 — Ops/admin pages (frontend only, static)

- [x] Ops pages built: intake, authentication, photography, listing, sold,
      exceptions, payouts. Admin pages built: users, pricing-config, integrations,
      analytics. Added `OpsShell` (sidebar split into Operations/Admin sections) +
      `app/(ops)/layout.tsx`.
- [x] Static/mocked data — reused `lib/mock-data.ts`; `/admin/integrations` reuses
      the colored-dot status pattern for platform/queue health

**Note:** the Impeccable `/critique` pass was deliberately deferred for Phases 2-4
at the user's explicit request (2pm PH deadline — critique is time-expensive). Ran
`lint`/`typecheck`/`build` (all clean, 27/27 routes) plus a lightweight Chrome
DevTools spot-check of `/`, `/items/[id]`, and `/ops/listing` instead of a full
dual-agent critique. **A full `/critique` pass across all three phases is still owed
before this ships publicly** — not a permanent exemption from CLAUDE.md's
end-of-phase critique convention, just a one-time deferral.

## Phase 5 — Supabase backend (schema, auth, storage)

- [x] Linked to the hosted Supabase project ("Copyt", ref `mmdkugibyurwktlidnyk`) via
      `supabase link`; `supabase/config.toml` scaffolded via `supabase init`
- [x] Finalized schema + migrations — `00001_init.sql` (unchanged, already correct
      per SPEC.md §5) plus two new migrations, all pushed and confirmed applied via
      `supabase migration list`
- [x] RLS policies — `00003_rls_policies.sql`: `is_staff()` helper, per-table
      policies (consignor scoped to own rows, staff/admin full access, internal
      tables staff-only), plus a `handle_new_user()` trigger on `auth.users` that
      auto-creates the matching `profiles` row (role defaults to `consignor`)
- [x] Supabase Auth wiring — `middleware.ts` + `lib/supabase/middleware.ts` (session
      refresh + role gating: `(portal)` requires sign-in, `(ops)` requires
      staff/admin role); `/login` and `/signup` converted from static forms to real
      Server Actions (`lib/actions/auth.ts`); sign-out wired into `Nav`,
      `PortalShell`, `OpsShell` (real profile name now shown instead of hardcoded
      placeholders)
- [x] Supabase Storage — `00004_storage.sql`: private `item-photos` bucket,
      path-scoped policies (`{user_id}/{item_id}/...`), staff/admin full access
- [x] Verified end-to-end against the live project: `supabase db push` applied
      clean; manual signup → email-confirmation-required flow confirmed correct
      (Supabase default); test account's `profiles` row confirmed created by the
      trigger; sign-in → `/dashboard` redirect confirmed with real profile name
      rendered; consignor account confirmed blocked from `/ops/intake` (redirected
      to `/`); unauthenticated `/dashboard` confirmed redirected to `/login`; test
      account deleted after verification. `lint`/`typecheck`/`build` all pass.
- [x] Queues/Cron integrations confirmed enabled on the project: `pgmq` (v1.5.1),
      `pg_cron` (v1.6.4), `pg_net` (v0.20.4) all verified live via
      `pg_extension` query

## Phase 6 — Wire consignor portal to real data

Scoped to the consignor portal only, per SPEC.md §7's phase table (the
authoritative granular breakdown — ops/admin dashboard wiring is explicitly
Phase 11; marketing has no per-user data needs beyond Phase 5's auth-aware Nav).

- [x] Two additive schema migrations surfaced while wiring: `00005` adds
      `items.estimated_value` (no price/value column existed — needed for
      dashboard/items/detail displays), `00006` adds `items.description` (no
      name/description column existed — items were otherwise unidentifiable to
      a consignor beyond SKU). Both pushed and confirmed applied.
- [x] Relocated `ITEM_STATUS_ORDER`/`PLATFORM_LABELS` from `lib/mock-data.ts` to
      `lib/pipeline.ts` (real domain constants, not mock data)
- [x] Data helpers: `lib/data/items.ts` (`getItemsForCurrentUser`, `getItemById`,
      `getDashboardStats`), `lib/data/payouts.ts` (`getPayoutsForCurrentUser`) —
      thin wrappers over the Phase 5 `createClient()` pattern, relying on RLS for
      row scoping
- [x] Server Actions: `lib/actions/items.ts` (`createIntake` — real insert with a
      generated placeholder SKU/barcode, reconciled with physical scanning in
      Phase 11), `lib/actions/profile.ts` (`updateProfile`)
- [x] Wired: `/dashboard` (real stats + recent items, empty state for new
      consignors), `/items` (real list + working status filter via new
      `ItemsFilterClient`), `/items/[id]` (real item + listings, RLS-backed 404
      for non-owned items), `/payouts` (real earnings history, empty state),
      `/settings` (real profile name edit; payout method/notifications stay
      static "coming in a later phase" placeholders — no Stripe/notification
      tables yet), `/intake/new` (real single-item insert; shipping fields stay
      UI-only, no shipping-request table in SPEC.md §5)
- [x] Verified end-to-end against the live project: `supabase db push` applied
      00005+00006 clean; full manual flow (signup → hit Supabase's email rate
      limit from repeated Phase 5/6 testing, correctly surfaced via the error
      banner → created a confirmed test account via the Admin API instead →
      signed in → submitted a real intake → item appeared on `/dashboard` and
      `/items` → `/items/[id]` rendered the real status tracker → `/settings`
      name edit persisted and reflected live in the nav → `/payouts` empty state
      correct); RLS policies on `items` reconfirmed directly via `pg_policies`.
      Test item + account deleted after verification.
      `lint`/`typecheck`/`build` all pass.

## Phase 7 — Queueing, cron, background jobs

This file's Phase 7 heading bundles what SPEC.md §7's more granular phase table
splits into 7 (queueing), 8 (cron), 9 (background jobs/notifications), 11 (ops
wiring). Following SPEC.md's narrower scoping (as flagged in Phase 6): this
section covers both SPEC's Phase 7 (queueing) and Phase 8 (cron), done as two
separate passes.

- [x] pgmq queues wired to Edge Functions — `webhook-ingest` and
      `delist-everywhere` queues created (`00007_queues.sql`), both Edge
      Functions completed and deployed. `delist-everywhere` had a real gap
      (never recorded the sale or marked the winning listing/item sold) —
      fixed as part of this pass, not left as-is.
- [x] Database Webhooks where event-triggered — implemented as Postgres
      triggers on the pgmq queue tables calling `net.http_post` against the
      deployed Edge Functions (secrets via Supabase Vault), since dashboard
      Database Webhooks and this are the same underlying mechanism.
- [x] pg_cron scheduled jobs (SPEC.md Phase 8) — all four jobs from SPEC.md §6
      built, scheduled, and verified: `weekly-payout-batch` (real — creates
      pending `payouts` rows from unpaid sales, one per sale, idempotent),
      `daily-reconciliation` (real internal consistency checks: sold items
      with lingering active listings, listed items with no active listing —
      no external marketplace credentials needed for this), `sla-breach-check`
      (real — flags items in `received`/`authenticating` past a 48h
      threshold), `nightly-reprice` (honest no-op — SPEC §3.5 needs a comps
      source and seller-set price bounds that don't exist anywhere in the
      schema; deployed and scheduled but explicitly logs why it skips rather
      than inventing fake repricing logic). Invocation via `pg_cron` →
      `net.http_post` → deployed Edge Function, reusing Phase 7's Vault
      secrets; `00010_cron_jobs.sql` supersedes `00002_cron.sql`'s commented-
      out template as that file's own note intended.
- [x] Verified against the live project: all four jobs confirmed registered
      via `cron.job` with correct schedules; each manually invoked (not
      waiting on real fire times) against seeded test data —
      `weekly-payout-batch` created exactly one pending payout then created
      zero on replay (idempotent), `sla-breach-check` correctly flagged a
      seeded 72h-old item as 24h overdue, `daily-reconciliation` correctly
      flagged a seeded orphaned `listed` item, `nightly-reprice` returned its
      no-op response. Test data cleaned up. `lint`/`typecheck`/`build` all pass.
- [ ] Real cross-platform publishing (StockX/eBay/Whatnot) — requires sandbox
      API credentials, still not available; `webhook-ingest` uses a documented
      normalized interim contract (`{event, itemId, salePrice}`) until then

**Demo-readiness pass** (fills in the "TODO: call the platform API" stubs left
by Phases 7-8, since STOCKX_API_KEY/EBAY_API_KEY/WHATNOT_API_KEY are confirmed
to stay unset for the demo):
- [x] `PlatformAdapter` interface (`publish`/`delist`/`getComps`) with
      `MockPlatformAdapter` (instant fake data, deterministic-ish comps per
      SKU) and `RealPlatformAdapter` (honest, never-exercised, documented
      starting point) — duplicated across `lib/platform-adapter.ts` (Node) and
      `supabase/functions/_shared/platform-adapter.ts` (Deno), two runtimes
      with different env-access mechanisms. Adapter selection checks
      `STOCKX_API_KEY`/`EBAY_API_KEY`/`WHATNOT_API_KEY` presence per platform.
- [x] `delist-everywhere`'s real TODO wired to `adapter.delist()`;
      `nightly-reprice` upgraded from a full no-op to real comp-averaging via
      `adapter.getComps()` (still no seller-set price bounds anywhere in the
      schema, so bounds enforcement stays honestly unenforced — narrower gap,
      not the whole job skipped). Both redeployed.
- [x] "Simulate Sale" — reuses the exact Phase 7 webhook chain (same
      `pgmq_send('webhook-ingest', ...)` call the Route Handler uses, not a
      shortcut that writes to `sales` directly) via `lib/actions/
      simulate-sale.ts`. Shown only next to listings whose platform is in mock
      mode, on `/items/[id]` (portal) and a new "Simulate a sale (demo)"
      section on `/ops/sold` — the latter two are explicit, scoped exceptions
      to "ops pages stay mock until Phase 11," additive only, existing mock
      content on both pages untouched.
- [x] `/admin/integrations` gained a real "Mock mode"/"Real" badge per
      platform (env-var-derived, computed server-side) — same scoped-exception
      pattern, existing mock rate-limit/health rows untouched.
- [x] `scripts/seed.mjs` (`npm run seed`) — idempotent by email, creates a
      demo consignor + 10 items spread across every pipeline stage, with real
      `listings` rows (via `MockPlatformAdapter.publish()` for realistic
      `external_id`s) for the listed items and a real `sales`/`payouts` row
      for the already-sold one.
- [x] Verified via Chrome DevTools MCP + direct DB queries: seeded data
      renders on `/dashboard`/`/items`; opened the item listed on all three
      mock platforms, clicked Simulate Sale on StockX, confirmed via SQL that
      StockX → `sold`, eBay/Whatnot → `delisted`, one `sales` row at the
      listing's price, and a message landed in the `notify-status-change`
      queue for that item (confirms the chain reaches the same point Phase 7
      verified — sending is still Phase 9). Reloaded the item page and
      confirmed the status tracker moved to SOLD. Screenshotted
      `/admin/integrations` (all three platforms tagged "Mock mode") and
      `/ops/sold`'s new demo section (correctly dropped the just-sold item
      from the simulatable list once its listings were no longer active).
      `lint`/`typecheck`/`build` all pass.
- **Two real incidents during this pass, both resolved and documented in the
  affected migrations' comments**: (1) the codebase assumed a `pgmq_public`
  wrapper schema that was never actually created (only the `pgmq` extension
  had been enabled via SQL, not the Dashboard's "Enable Queues" toggle) —
  attempting to expose that nonexistent schema via the Management API broke
  PostgREST's schema cache for the *entire* project for several minutes before
  being reverted; fixed instead with `public`-schema wrapper RPCs
  (`00008_pgmq_wrappers.sql`), avoiding further PostgREST config changes. (2)
  That first wrapper's `pgmq_pop` had a column-count mismatch against
  `pgmq.pop()`'s actual 6-column return shape, silently swallowed as "no
  message" by both Edge Functions' error handling — fixed in
  `00009_fix_pgmq_pop.sql`, and both functions now surface pop errors instead
  of masking them as empty queues.
- [x] Verified end-to-end against the live project: real webhook POST → queue
      insert → trigger → Edge Function → second queue → trigger → Edge
      Function chain, confirmed via direct DB queries (`items.status` →
      `sold`, winning listing → `sold`, losing listing → `delisted`, one
      `sales` row, one `pipeline_events` row). Idempotency confirmed by
      replaying the identical webhook: still exactly one `sales` row and one
      `pipeline_events` row. Test item/listings/account deleted afterward.
      `lint`/`typecheck`/`build` all pass.

**Phase 9 — Background jobs** (SPEC.md §7's Phase 9: image enhancement +
notifications + auth-score stub). Asked which email provider before assuming
one, per BUILD_PROMPTS.md — user chose **Resend**; `RESEND_API_KEY` stays
unset in this project, so `MockEmailAdapter` is what actually runs, same
mock/real split as the platform adapters:
- [x] `notify-status-change` rewritten. Its Phase 4/scaffold stub had a real
      bug — it called `supabase.schema("pgmq_public").rpc("pop", ...)`, but
      `pgmq_public` was confirmed in Phase 7 to never exist, so this function
      would have 500'd on every invocation. Fixed to use the same
      `public.pgmq_pop` RPC every other consumer uses. Now looks up the
      consignor's email via `supabase.auth.admin.getUserById()`, sends via
      `getEmailAdapter()` (`_shared/email-adapter.ts`: `MockEmailAdapter`/
      `ResendEmailAdapter`, same shape as `_shared/platform-adapter.ts`), and
      writes a `queue_job_log` row. The queue's trigger (`on_notify_status_
      change_insert`) was also added — Phase 7 deliberately created the queue
      but skipped this trigger, noting "consuming it is Phase 9's job."
- [x] `auth-score` — new Edge Function + `auth_scores` table + `auth-score`
      pgmq queue (`00011_phase9.sql`). Real ML scoring is out of scope for
      MVP (stub score, deterministic hash of `sku`, same technique as
      `MockPlatformAdapter.getComps`). There was no existing real code path
      that moved an item from `received` to `authenticating` — `createIntake`
      only ever inserted at `received`, and `/ops/intake` staff scanning is
      still Phase 4 mock — so `createIntake` (`lib/actions/items.ts`) became
      the real producer: it now enqueues `auth-score` right after inserting
      the item. The consumer inserts the score, advances `received →
      authenticating` (idempotency guard: only if still `received`), and
      enqueues `notify-status-change`.
- [x] `/ops/authentication` wired to real data and real actions — an explicit,
      scoped exception to "ops pages stay mock," granted by Phase 9's own text
      ("wire the queue/table so a human reviewer can approve/reject"), same
      category as the demo-readiness pass's exceptions for `/ops/sold` and
      `/admin/integrations`. Approve/Flag are now `lib/actions/
      authentication.ts` Server Actions (`items.status → photographed` or
      `→ flagged`, real `pipeline_events` row with `actor` set to the acting
      staff user's id, `notify-status-change` enqueued) instead of
      non-functional mock buttons. The page displays each item's latest
      `auth_scores` row when one exists.
- [x] `image-enhance` — Database-Webhook-equivalent trigger
      (`on_item_photo_upload`) on `storage.objects` inserts scoped to the
      `item-photos` bucket. Real image processing is out of scope for MVP
      (explicitly stubbed per BUILD_PROMPTS.md) — the function parses
      `{user_id}/{item_id}/...` from the uploaded object's path and writes a
      `queue_job_log` row, nothing more. Needed extending `public.
      invoke_edge_function()` (Phase 7) to pass the inserted row as a JSON
      body (`{"record": ...}`) — additive; the other three consumers pop from
      their queue table directly and ignore any request body.
- [x] `weekly-payout-batch`'s `sold → paid` transition doesn't exist yet (that
      job only creates `pending` payouts — the real status flip needs Stripe,
      Phase 10), so no `notify-status-change` hook was added there. Flagged
      as an honest gap, not silently skipped.
- [x] Verified end-to-end against the live project (Chrome DevTools MCP +
      direct SQL, since `supabase db push`/`supabase functions deploy` hung
      the CLI at "Initialising login role..." again — worked around via the
      Management API's `/database/query` SQL endpoint for the migration and
      `--use-api` for function deploys, same category of workaround as
      Phase 7's incident, no PostgREST config touched this time): submitted a
      real intake as the demo consignor → confirmed via SQL the item flipped
      `received → authenticating` with a real stub score and a `queue_job_log`
      row; signed in as staff, saw the item in `/ops/authentication` with its
      score, clicked Approve → confirmed `items.status → photographed`, a
      `pipeline_events` row with `actor` = the staff user's real id, and a
      second `notify-status-change` job logged `sent`; uploaded a test object
      directly to the `item-photos` bucket → confirmed an `image-enhance`
      `queue_job_log` row. `notify-status-change`'s fix was also confirmed
      against a stale leftover message from Phase 7 testing that had been
      sitting unprocessed in the queue — it drained and logged `sent`
      instead of 500ing. Test item and its rows deleted afterward (seeded
      demo data and the two demo accounts left in place, per the
      demo-readiness pass). `lint`/`typecheck`/`build` all pass.

## Phase 8 — Payments, ops dashboard, polish pass

- [x] Stripe Connect payouts (SPEC.md §7's Phase 10) — sandbox only, per user
      instruction. Account type: **Express** (walked through in Plan Mode
      before implementing, per BUILD_PROMPTS.md's explicit ask) — Stripe
      hosts onboarding, the platform stays in control of payout timing (our
      weekly batch, not the consignor's own Stripe login), and Stripe owns
      identity verification/compliance. Standard was wrong fit (consignors
      aren't businesses wanting their own Stripe relationship); Custom was
      more build surface than this MVP needs.
  - [x] `lib/actions/stripe-connect.ts` — `connectPayoutAccount()` creates a
        Stripe Express account for the consignor (stored in the existing
        `profiles.payout_method_id` column, no migration needed for that
        part), creates an Account Link, redirects into Stripe's hosted
        onboarding. `/settings`'s Payout method card is now real: shows
        "Not connected"/"Onboarding incomplete"/"Connected" by live-checking
        `stripe.accounts.retrieve()` on render — deliberately no
        `account.updated` webhook (would need a new Route Handler +
        `STRIPE_WEBHOOK_SECRET`, real scope not asked for; live-check is
        simpler and always current).
  - [x] `00012_stripe_payouts.sql` — additive `stripe_transfer_id`/`error`
        columns on `payouts` for traceability (same pattern as `queue_job_log`).
  - [x] `weekly-payout-batch` rewritten to attempt a real Stripe transfer
        (`npm:stripe@^17` import - Edge Functions support `npm:` specifiers,
        same as the existing `jsr:` import) for every `pending`/`blocked`
        payout, using `idempotencyKey: payout.id` (same idempotency
        discipline CLAUDE.md requires for pgmq jobs, applied here even though
        this isn't a queue consumer). No connected account → `blocked`
        (retried next run, in case the consignor connects later). Transfer
        succeeds → `paid`/`paid_at`/`stripe_transfer_id`. Transfer rejected
        by Stripe → `failed` with the real error message — **not**
        auto-retried on subsequent runs (only `pending`/`blocked` are
        re-attempted), matching real payment-system practice: a failed
        transfer needs human review, not silent infinite retries. Writes a
        `queue_job_log` row per attempt.
  - [x] `/ops/payouts` rewritten from a hardcoded `BATCHES` array + fake stat
        blocks to a real async Server Component (real payout total/count
        stats, real consignor names via a `profiles` join, real
        status/error per row).
  - **Two real, external blockers hit during verification, both resolved by
    account-level Stripe Dashboard settings, not code changes**: (1) the
    Stripe test account didn't have Connect enabled yet
    (`dashboard.stripe.com/connect`); (2) the account was new enough that
    Stripe defaults new integrations to Accounts v2 and rejected the v1
    `accounts.create()` call — resolved by enabling the "Accounts v1 support"
    compatibility toggle Stripe itself offers for this exact scenario
    (`dashboard.stripe.com/settings/features/feat_accounts_v1_support`),
    chosen over migrating to the v2 API since this project is sandbox-only
    and the existing Express/Account-Links code is correct v1-era usage.
  - **Verified live against the real Stripe test-mode API, fully closed the
    loop**: account creation succeeded (`acct_1TykhbJaD8jdSoh0`) and the
    redirect landed on Stripe's real hosted onboarding page (correctly
    branded "Copyt Concierge sandbox," test-mode banner present). Completing
    the hosted onboarding form hit an hCaptcha bot-check that couldn't be
    automated through responsibly, so the user completed it manually
    (`payouts_enabled` confirmed `true` via a direct `accounts.retrieve()`
    check afterward).
  - **A real bug found and fixed while closing the loop**: after onboarding
    completed, `weekly-payout-batch` kept reproducing the exact same stale
    "capabilities" error on every retry, across three different fix attempts
    (bumping the `npm:stripe` Deno import from `^17` to `^22.4.0` to match
    the Node SDK; then rewriting the transfer call as a plain `fetch` against
    `api.stripe.com` with an explicit `Stripe-Version` header, ruling out
    Deno/npm-interop and API-version drift as suspects) — none of which
    changed the outcome, because the real cause was a **Stripe idempotency
    key bug**: the transfer call reused `payout.id` as `idempotencyKey`
    across every retry, so Stripe was replaying its *cached 24h response
    from the very first (correctly-rejected) attempt* regardless of what
    changed server-side afterward. Confirmed via a direct local call with a
    fresh key succeeding while the app's stable key kept failing. Fixed by
    generating a fresh `crypto.randomUUID()` per transfer attempt instead —
    double-transfer protection already comes from `payouts.status` (only
    `pending`/`blocked` rows are selected, and a success flips a row to
    `paid` before it could be re-picked-up), so the Stripe-level idempotency
    key wasn't actually needed for correctness, only for surviving a replay
    within the same run. Also switched the whole function from the
    `npm:stripe` SDK to a direct `fetch`, which stays even though the SDK
    wasn't the actual bug — one less runtime dependency in the Deno function,
    consistent with how this project already prefers raw REST/`net.http_post`
    over SDKs inside Edge Functions.
  - Two rounds of manual Stripe test-mode balance top-ups were needed
    (`stripe.charges.create` with the `tok_bypassPending` special test token,
    which is Stripe's documented way to add instantly-available test balance)
    since a platform's Connect balance starts at $0 in test mode and each
    transfer draws it down — a test-mode-only prerequisite, unrelated to app
    code, done via one-off script rather than building any balance-funding
    feature into the app (there's no real product flow where money enters
    Copyt's own Stripe balance directly).
  - **Final confirmed state**: all 4 `payouts` rows (the original seed-script
    row plus the 3 real sales `weekly-payout-batch` picked up) are `paid`,
    3 with real `stripe_transfer_id`s from the live test-mode API.
    `/ops/payouts` screenshotted showing all 4 as "Paid," $2,025.00 total,
    0 awaiting. `lint`/`typecheck`/`build` all pass.
- [x] Login page demo-credentials picker — `components/DemoCredentialsPicker.tsx`,
      a small client component on `/login` with a "Demo account" dropdown
      (Consignor / Staff-Admin) that fills the existing email/password inputs
      by `id` on selection, leaving the rest of the page a Server Component.
      Demo convenience only, not gated behind any env check (this whole build
      is a demo/sandbox project per CLAUDE.md). Verified end-to-end via
      Chrome DevTools MCP: selecting an option fills both fields and
      submitting actually authenticates.
- [x] Final ops dashboard functionality (SPEC.md §7's Phase 11 — this file's
      Phase 8 heading bundles it, per the note at the top of the Phase 7
      section). BUILD_PROMPTS.md's Phase 11 prompt names exactly three
      items — that's what got wired; `/admin/pricing-config` and
      `/admin/users` are explicitly **not** in that list and also have no
      backing schema (`pricing_tiers`/commission/take-rate — grepped every
      migration, zero matches), so both stay mock rather than inventing a
      pricing model that was never specified.
  - [x] `/ops/intake` — real barcode/SKU lookup (`lib/actions/intake.ts`)
        against real `items`, not an item-creator (items already get created
        by the consignor's own `/intake/new`). Real "recently logged" list.
  - [x] `/ops/photography` — real file upload (`lib/actions/photography.ts`)
        to the `item-photos` bucket using the staff session's own client
        (existing `item-photos: staff full access` RLS policy from
        `00004_storage.sql` covers it, no service role needed). This is the
        first real trigger source Phase 9's `image-enhance` Storage webhook
        ever had — confirmed firing on a real upload.
  - [x] `/ops/listing` — the biggest real feature this phase:
        `lib/actions/listing.ts` creates real `listings` rows via
        `getAdapter(platform).publish()` (the same mock/real adapter from
        the demo-readiness pass), inserts a `photographed→listed`
        `pipeline_events` row (actor = the real staff user), flips
        `items.status`, and enqueues `notify-status-change` — same shape as
        `lib/actions/authentication.ts`'s existing pattern. `items` has no
        `price` column, so price is collected at listing time instead of
        reading a nonexistent suggested price (prefilled from
        `estimated_value` where available).
  - [x] `/ops/sold`'s remaining `MOCK_SALES` feed replaced with a real
        `sales` query, cross-referencing each sale's other `listings`
        (`status = 'delisted'`) for the "Delisted from X" badges. The
        already-real "Simulate a sale" section above it (Phase 9) untouched.
  - [x] `/ops/exceptions` — real `items` where `status = 'flagged'`, joined
        to each item's `pipeline_events` row for `flaggedAt`/actor. No
        reason column exists anywhere in the schema, so instead of
        reinventing the mock's fabricated per-item reasons
        ("Suspected counterfeit," etc.), it shows one honest fixed label —
        "Flagged during authentication review" — describing the one real
        place flagging happens (`lib/actions/authentication.ts`'s
        `flagItem`). Seed-data items flagged directly (no `pipeline_events`
        row) correctly fall back to "Unknown"/"Unknown" rather than guessing.
  - [x] `/admin/analytics` — real per-status item counts, a live 48h-SLA-
        breach recompute (the underlying `sla-breach-check` Edge Function
        only ever `console.error`s breaches — no persistence table exists,
        confirmed by its own code comment — so this recomputes the identical
        query rather than inventing a breach-history table), and real gross
        sales from `sales.sale_price`. The mock card's "Total commission
        earned" label was a real problem, not just cosmetic — no commission/
        take-rate schema exists anywhere, so that number was never
        computable. Relabeled honestly to "Gross sales (30d)" with an
        explicit note about the missing pricing-tier data, instead of
        quietly leaving a fabricated-sounding label on a now-real number.
  - [x] `/admin/integrations`'s Supabase Queues/Cron rows wired to two new
        staff-only RPCs (`00013_admin_ops_rpcs.sql`): `get_queue_depths()`
        wraps `pgmq.metrics_all()` (confirmed available on the live
        project), `get_cron_jobs()` reads `cron.job` directly — neither
        schema is exposed to PostgREST otherwise. StockX/eBay/Whatnot rows
        untouched (already-real "Mock mode"/"Real" badges from the
        demo-readiness pass; their health/rate-limit numbers stay mock since
        `platform_accounts.rate_limit_state` is never written by any
        adapter — building live rate-limit checks against marketplace APIs
        that don't exist isn't possible, and wasn't newly invented here).
  - **Verified end-to-end against the live project** (Chrome DevTools MCP +
        direct SQL; `supabase db push` hung the CLI again — same Management
        API `/database/query` workaround as Phases 9-10): signed in as
        `demo.staff@copyt-concierge.test` via the new login dropdown.
        `/admin/integrations` showed "1 pending message"/"4 / 4 jobs active,"
        confirmed matching direct `pgmq.metrics_all()`/`cron.job` queries.
        `/admin/analytics`'s gross sales ($1,370.00) and per-status counts
        confirmed matching direct SQL. `/ops/exceptions` showed the real
        seeded flagged item. `/ops/sold` showed real sales with correct
        delisted-platform badges. `/ops/intake` correctly found a real SKU
        and correctly reported "no match" for a bogus one. `/ops/photography`
        uploaded a real test image — confirmed both the Storage object
        landing at the correct `{user_id}/{item_id}/...` path and a new
        `image-enhance` `queue_job_log` row (Phase 9's trigger firing for
        real for the first time). `/ops/listing` published two items with
        real mock-adapter `listings` rows, confirmed via SQL: `items.status
        → listed`, `pipeline_events` with the real staff actor, and
        `notify-status-change` logged `sent`. One red herring during
        verification: the first publish's `notify-status-change` message
        initially looked unconsumed — turned out the queue had 2 messages
        (a stale one left over from earlier phases' manual testing sitting
        ahead of the new one), and the trigger-fired invocation correctly
        popped the older one; a second, clean-queue publish confirmed the
        real chain works exactly as expected — not a Phase 11 bug, just
        accumulated test debris self-clearing. Test photo deleted afterward.
        `lint`/`typecheck`/`build` all pass.

---

**Notes**

- Every pgmq job must be idempotent (matters most for cross-platform delisting).
- Never call a marketplace API directly from client components — always via a server
  action or Route Handler.
- Run an Impeccable `/critique` pass at the end of frontend phases since running it every after phase takes too long and is not worth it.
- Use Plan Mode before starting a new phase.
