// Supabase Edge Function: pg_cron-triggered, 2am daily. Rescans comps for
// every active listing via the PlatformAdapter and updates the listing price
// to the average comp. No seller-set price bounds exist anywhere in the
// schema (items has estimated_value, not a min/max) - "adjustment within
// seller-set bounds" per SPEC.md §3.5 stays unenforced until that column
// exists; this is now real for the comps-rescan half of the job, not a full
// no-op like before.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { getAdapter } from "../_shared/platform-adapter.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async () => {
  const { data: listings, error } = await supabase
    .from("listings")
    .select("id, platform, price, items(sku)")
    .eq("status", "active");

  if (error) {
    console.error("[nightly-reprice] failed to load listings", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
  }

  let repriced = 0;

  for (const listing of listings ?? []) {
    const sku = (listing.items as unknown as { sku: string } | null)?.sku;
    if (!sku) continue;

    const comps = await getAdapter(listing.platform).getComps(sku);
    if (!comps.length) continue;

    const avg = Math.round(comps.reduce((sum, c) => sum + c.price, 0) / comps.length);

    if (avg !== Number(listing.price)) {
      await supabase.from("listings").update({ price: avg }).eq("id", listing.id);
      repriced++;
    }
  }

  return new Response(JSON.stringify({ ok: true, repriced }), { status: 200 });
});
