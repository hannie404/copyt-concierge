// Supabase Edge Function: pg_cron-triggered, Monday 9am. Finds sold items
// whose sale hasn't been turned into a payout record yet, creates one
// pending payout per sale, then attempts a real Stripe Connect transfer
// (test mode) for every pending/blocked payout. See SPEC.md §3.6, §6,
// docs/PLAN.md Phase 10 for the Express-account reasoning.

import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;

// Plain REST calls instead of the npm:stripe SDK, matching how this project
// already prefers raw REST/net.http_post over SDKs inside Edge Functions.
const STRIPE_API_VERSION = "2026-07-29.dahlia"; // keep in sync with the "stripe" npm package used in lib/stripe.ts

async function createStripeTransfer(amountCents: number, destination: string, idempotencyKey: string) {
  const body = new URLSearchParams({
    amount: String(amountCents),
    currency: "usd",
    destination,
  });

  const res = await fetch("https://api.stripe.com/v1/transfers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Idempotency-Key": idempotencyKey,
      "Stripe-Version": STRIPE_API_VERSION,
    },
    body,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? `Stripe transfer failed: ${res.status}`);
  return data as { id: string };
}

async function logJob(status: string, error?: string) {
  await supabase.from("queue_job_log").insert({
    queue_name: "weekly-payout-batch",
    job_type: "weekly-payout-batch",
    status,
    error: error ?? null,
  });
}

Deno.serve(async () => {
  const { data: sales, error } = await supabase
    .from("sales")
    .select("id, sale_price, item_id, items(user_id)");

  if (error) {
    console.error("[weekly-payout-batch] failed to load sales", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
  }

  let created = 0;

  for (const sale of sales ?? []) {
    // Idempotency: skip sales that already produced a payout.
    const { data: existing } = await supabase
      .from("payouts")
      .select("id")
      .eq("batch_id", `sale_${sale.id}`)
      .maybeSingle();

    if (existing) continue;

    const userId = (sale.items as unknown as { user_id: string } | null)?.user_id;
    if (!userId) continue;

    await supabase.from("payouts").insert({
      user_id: userId,
      amount: sale.sale_price,
      // Encodes the source sale in batch_id for the idempotency check above -
      // a real multi-sale batch grouping isn't asked for here (SPEC.md §5 has
      // no batch/line-item table), so one payout row per sale keeps this
      // honest rather than inventing a grouping scheme.
      batch_id: `sale_${sale.id}`,
      status: "pending",
    });
    created++;
  }

  // Second pass: attempt a real transfer for every payout still awaiting one.
  // 'blocked' payouts are retried too, in case the consignor has since
  // connected a payout account.
  const { data: outstanding } = await supabase
    .from("payouts")
    .select("id, user_id, amount")
    .in("status", ["pending", "blocked"]);

  let paid = 0;
  let blocked = 0;
  let failed = 0;

  for (const payout of outstanding ?? []) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("payout_method_id")
      .eq("id", payout.user_id)
      .single();

    if (!profile?.payout_method_id) {
      await supabase.from("payouts").update({ status: "blocked" }).eq("id", payout.id);
      await logJob("blocked", "consignor has no connected Stripe account");
      blocked++;
      continue;
    }

    try {
      // Idempotency key is per-attempt, not per-payout: reusing payout.id
      // across retries would make Stripe replay the *first* attempt's
      // cached response (including a stale error) for 24h, masking any
      // real state change since (e.g. the consignor finishing onboarding).
      // Double-transfer protection instead comes from payouts.status - this
      // query only selects pending/blocked rows, and a successful transfer
      // flips a row to 'paid' before it could be picked up again.
      const transfer = await createStripeTransfer(
        Math.round(Number(payout.amount) * 100),
        profile.payout_method_id,
        crypto.randomUUID()
      );

      await supabase
        .from("payouts")
        .update({ status: "paid", paid_at: new Date().toISOString(), stripe_transfer_id: transfer.id, error: null })
        .eq("id", payout.id);

      await logJob("paid");
      paid++;
    } catch (transferError) {
      const message = transferError instanceof Error ? transferError.message : String(transferError);
      await supabase.from("payouts").update({ status: "failed", error: message }).eq("id", payout.id);
      await logJob("failed", message);
      failed++;
    }
  }

  return new Response(JSON.stringify({ ok: true, created, paid, blocked, failed }), { status: 200 });
});
