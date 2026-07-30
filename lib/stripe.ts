import Stripe from "stripe";

// Test-mode key only (this project's Stripe usage is sandbox-only per
// CLAUDE.md/Phase 10 scope) - see lib/actions/stripe-connect.ts and
// supabase/functions/weekly-payout-batch for where this is used.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
