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

- [ ] Finalize Postgres schema + migrations
- [ ] RLS policies
- [ ] Supabase Auth wiring
- [ ] Supabase Storage for item photos
- [ ] Requires: Supabase project + Queues/Cron integrations enabled (see `supabase/README.md`)

## Phase 6 — Wire pages to real data

- [ ] Connect marketing/portal/ops pages to Supabase, phase by phase (per SPEC.md §7,
      adapted for Supabase)

## Phase 7 — Queueing, cron, background jobs

- [ ] pgmq queues wired to Edge Functions
- [ ] pg_cron scheduled jobs
- [ ] Database Webhooks where event-triggered
- [ ] Real cross-platform publishing (StockX/eBay/Whatnot) — requires sandbox API credentials

## Phase 8 — Payments, ops dashboard, polish pass

- [ ] Stripe Connect payouts (requires Stripe test account)
- [ ] Final ops dashboard functionality
- [ ] Impeccable polish pass across the app

---

**Notes**

- Every pgmq job must be idempotent (matters most for cross-platform delisting).
- Never call a marketplace API directly from client components — always via a server
  action or Route Handler.
- Run an Impeccable `/critique` pass at the end of frontend phases since running it every after phase takes too long and is not worth it.
- Use Plan Mode before starting a new phase.
