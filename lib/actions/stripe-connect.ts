"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

async function getOrigin() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

// Creates a Stripe Express connected account for the current consignor (if
// one doesn't already exist) and redirects them into Stripe's hosted
// onboarding flow. See docs/PLAN.md Phase 10 for why Express over Standard/
// Custom.
export async function connectPayoutAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("payout_method_id")
    .eq("id", user.id)
    .single();

  let accountId = profile?.payout_method_id ?? null;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email: user.email,
      capabilities: { transfers: { requested: true } },
    });
    accountId = account.id;
    await supabase.from("profiles").update({ payout_method_id: accountId }).eq("id", user.id);
  }

  const origin = await getOrigin();
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/settings?stripeRefresh=1`,
    return_url: `${origin}/settings?stripeReturn=1`,
    type: "account_onboarding",
  });

  redirect(accountLink.url);
}
