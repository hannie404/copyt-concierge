---
target: dev/components gallery page
total_score: 18
max_score: 24
na_heuristics: 3,5,7,10
p0_count: 2
p1_count: 1
timestamp: 2026-07-29T22-42-24Z
slug: app-marketing-dev-components-page-tsx
---
Method: dual-agent (A: a35b7b65c6b99ac67 · B: ae31b16dcf27828b9)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | No live/loading states demoed — unverified |
| 2 | Match System / Real World | 4 | Sentence-case copy matches spec's Casing Split Rule |
| 3 | User Control and Freedom | n/a | No multi-step flow on this page |
| 4 | Consistency and Standards | 2 | Stat-row divider and status-dot colors drift from DESIGN.md's own spec |
| 5 | Error Prevention | n/a | No destructive/input actions present |
| 6 | Recognition Rather Than Recall | 2 | 3 of 7 status dots share one color, forcing label-reading instead of color-scanning |
| 7 | Flexibility and Efficiency | n/a | Not a power-user workflow surface |
| 8 | Aesthetic and Minimalist Design | 4 | Generous whitespace, one accent color, clear grouping |
| 9 | Error Recovery | 3 | No error states shown to verify either way |
| 10 | Help and Documentation | n/a | Internal dev tool, not applicable |
| **Total** | | **18/24** | **Good (75%)** |

## Design Specificity Verdict

**LLM assessment**: Reads as authored for Copyt Concierge, not generic SaaS — the magenta-on-white/magenta-on-dark duality, full-pill buttons, and the Glass Card floating-over-dark signature pattern are all distinctive and correctly executed. It slips toward generic in the Status Pill component: meant to be a second signature component per DESIGN.md, but 3 of 7 `ItemStatus` values (`authenticating`, `photographed`, `listed`) all render the same magenta dot, undercutting the "literal ItemStatus color-mapping" DESIGN.md promised.

**Deterministic scan**: Static CLI scan (`detect.mjs` against the page + all 7 component files) returned zero findings (exit 0, `[]`). The browser-injected runtime detector, run against the live rendered DOM, found 5 anti-patterns: 4× low-contrast text (white on `#E5178C` magenta = 4.3:1, needs 4.5:1 for WCAG AA) on the "Start free", "START FREE →", "Support" pill, and "Start free today" buttons, and 1× overused-font (Inter at 51% of text — flagged as a false positive below). The two detection modes disagree because contrast is a post-render/computed-style property that a source-level regex scan of `.tsx` can't evaluate — the browser pass is the one that matters here.

**False positive**: `overused-font` (Inter, 51% of text) — a body font dominating body-copy percentage is expected and intentional per DESIGN.md's Display/Body split; not a real issue.

## Overall Impression

The design system is genuinely coherent and on-brand — the two-radius rule, the light/dark duality, and the Glass Card pattern all read as authored for this specific product rather than assembled from a generic template. The two things holding it back from "ship it" are both concrete and narrow: the primary magenta button fails WCAG AA contrast by 0.2:1, and the Status Pill component — explicitly called out in DESIGN.md as a signature component reused across `/items` — currently can't do its one job of making 7 pipeline states visually distinct at a glance.

## What's Working

1. **Two-radius system discipline**: every interactive control is `rounded-full`, every content container is the 16px card radius, with zero violations found across both assessments.
2. **Light/dark duality delivers on the "Consignment Vault" north star**: the dark section's Glass Cards floating on the near-black maroon backdrop is the strongest, most specific visual moment on the page.
3. **Restrained elevation strategy**: `card-float` shadow reserved correctly for the one floating pattern; nothing else carries a gratuitous shadow.

## Priority Issues

**[P0] Status Pill color collision breaks the component's core purpose**
- **Why it matters**: 3 of 7 `ItemStatus` values (`authenticating`, `photographed`, `listed`) share `bg-brand-magenta`, so a real `/items` list with dozens of rows becomes unscannable by color — the entire point of a status-dot system.
- **Fix**: Assign each of the 7 states a distinct, intentional color; add the new tokens to DESIGN.md's palette rather than leaving them ad hoc in the component file.
- **Suggested command**: `$impeccable colorize`

**[P0] Primary button fails WCAG AA contrast (4.3:1, needs 4.5:1)**
- **Why it matters**: White text on `#E5178C` magenta is the primary CTA fill color used everywhere per DESIGN.md's "One Signal Rule" — failing contrast on the single most-used interactive element affects every low-vision user on every page that uses it.
- **Fix**: Darken the magenta fill slightly (or bump font-weight/size, which raises the AA threshold to 3:1 for large text) — confirmed live via the browser-injected detector, not just a static estimate.
- **Suggested command**: `$impeccable audit`

**[P1] `flagged` status uses an untokenized color (`red-500`)**
- **Why it matters**: `flagged` is arguably the most consequential pipeline state (failed authentication / needs staff attention) and currently reaches for a Tailwind default that doesn't exist anywhere in DESIGN.md's palette — it'll drift further as more components get built on top of it.
- **Fix**: Pick a deliberate "alert" token, add it to DESIGN.md and `tailwind.config.ts` as a named brand color.
- **Suggested command**: `$impeccable document`

**[P2] Stat-block divider treatment doesn't match the written spec**
- **Why it matters**: DESIGN.md's Layout section calls for "thin vertical dividers between blocks"; the implementation uses one horizontal top rule in the dark section and nothing in the light section. Small now, but this is exactly the drift a gallery review exists to catch before three marketing pages copy the wrong pattern.
- **Fix**: Either implement vertical dividers as specified, or update DESIGN.md to describe what was actually built.
- **Suggested command**: `$impeccable layout`

**[P2] No `focus-visible` treatment despite an explicit spec**
- **Why it matters**: DESIGN.md states buttons get "a 2px magenta ring offset from the fill," but `Button.tsx`/`PillNavItem.tsx` only define `hover:` states — keyboard/switch users get whatever the browser default provides, which is unlikely to be visible against magenta or transparent backgrounds.
- **Fix**: Add `focus-visible:ring-2 focus-visible:ring-brand-magenta focus-visible:ring-offset-2` to both components.
- **Suggested command**: `$impeccable harden`

## Persona Red Flags

**Jordan (first-timer)**: Cannot tell `authenticating`, `photographed`, and `listed` apart by color alone in the Status Pills row — would have to read all seven labels serially, the opposite of what a status-dot system promises to save on a real `/items` page with dozens of rows.

**Sam (accessibility)**: Two concerns — missing `focus-visible` styling on the exact page meant to prove out the interaction system, and the primary button's confirmed 4.3:1 contrast ratio falls short of WCAG AA (4.5:1) for normal-weight text.

**Riley (stress-tester)**: Would try clicking every pill-shaped element expecting uniform interactivity; `Card` (non-interactive `<div>`) vs. `PillNavItem` (`<button>`) are correctly shape-differentiated per the Two-Radius Rule, so this is a note rather than a real trap.

## Minor Observations

- Primary-button demo row shows "Start free" and "START FREE →" with identical copy side-by-side — fine for gallery completeness, but momentarily reads as two different live CTAs before the casing-variant intent registers.
- `Card` light variant adds a `border border-brand-grayPill` not mentioned in DESIGN.md's Cards section (background + radius + shadow strategy only) — likely pragmatic (keeps a white card visible on a white section), worth codifying in the doc if intentional.
- Page ends abruptly after the second Glass Card with a large trailing expanse of empty dark background — no closing signal for a page whose whole job is "here is everything, judge it."

## Questions to Consider

- If 3 of 7 statuses share one color today, was Status Pill actually validated against all seven `ItemStatus` values, or only spot-checked against one or two?
- Should the Glass Card / Status Pill "signature components" ship with a rendered legend (dot → meaning), given color-only encoding is inherently fragile?
- Zero disabled/loading/error states exist on this page — intentional Phase 1 scope cut, or a gap that'll surprise whoever wires this to real Supabase data in Phase 4?
