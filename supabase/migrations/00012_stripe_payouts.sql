-- Copyt Concierge - Phase 10: Stripe Connect payouts (test mode). Additive
-- columns on payouts for traceability - profiles.payout_method_id already
-- exists and holds the Stripe connected account id (acct_...), no migration
-- needed there. See BUILD_PROMPTS.md Phase 10, docs/PLAN.md.

alter table public.payouts add column stripe_transfer_id text;
alter table public.payouts add column error text;
