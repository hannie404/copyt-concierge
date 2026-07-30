// Supabase Edge Function: pg_cron-triggered, daily 3am. Internal consistency
// check between items/listings state - no external marketplace credentials
// exist yet, so this checks our own data's internal integrity rather than
// reconciling against real StockX/eBay/Whatnot state. See SPEC.md §6.

import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async () => {
  // Check 1: sold items that still have more than one active listing - would
  // mean Phase 7's delist-everywhere logic failed to delist everywhere.
  const { data: soldItems } = await supabase.from("items").select("id").eq("status", "sold");

  const multiActiveSold: string[] = [];
  for (const item of soldItems ?? []) {
    const { count } = await supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("item_id", item.id)
      .eq("status", "active");
    if ((count ?? 0) > 0) multiActiveSold.push(item.id);
  }

  // Check 2: items marked "listed" with zero active listings - orphaned,
  // should have either an active listing or a different status.
  const { data: listedItems } = await supabase.from("items").select("id").eq("status", "listed");

  const orphanedListed: string[] = [];
  for (const item of listedItems ?? []) {
    const { count } = await supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("item_id", item.id)
      .eq("status", "active");
    if ((count ?? 0) === 0) orphanedListed.push(item.id);
  }

  if (multiActiveSold.length) {
    console.error("[daily-reconciliation] sold items with active listings still open:", multiActiveSold);
  }
  if (orphanedListed.length) {
    console.error("[daily-reconciliation] listed items with no active listing:", orphanedListed);
  }

  return new Response(
    JSON.stringify({ ok: true, multiActiveSold, orphanedListed }),
    { status: 200 }
  );
});
