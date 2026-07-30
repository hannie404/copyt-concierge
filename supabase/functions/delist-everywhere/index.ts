// Supabase Edge Function: the trust-critical job. When an item sells on one
// platform, record the sale and delist it everywhere else. MUST be idempotent
// - safe to replay without double-recording the sale or double-delisting.
// See SPEC.md §3.4, §6.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { getAdapter } from "../_shared/platform-adapter.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async () => {
  const { data, error } = await supabase.rpc("pgmq_pop", { queue_name: "delist-everywhere" });

  if (error) {
    console.error("[delist-everywhere] pop failed", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
  }
  if (!data?.length) {
    return new Response(JSON.stringify({ ok: true, processed: 0 }), { status: 200 });
  }

  const { message } = data[0];
  const { itemId, soldOnPlatform, salePrice } = message as {
    itemId: string;
    soldOnPlatform: string;
    salePrice: number;
  };

  // Primary idempotency guard: if this item is already sold/paid, this
  // message was already processed - replaying it is a no-op.
  const { data: item } = await supabase
    .from("items")
    .select("status")
    .eq("id", itemId)
    .single();

  if (!item || item.status === "sold" || item.status === "paid") {
    return new Response(JSON.stringify({ ok: true, skipped: "already processed" }), {
      status: 200,
    });
  }

  const { data: winningListing } = await supabase
    .from("listings")
    .select("id")
    .eq("item_id", itemId)
    .eq("platform", soldOnPlatform)
    .single();

  // Belt-and-suspenders: skip if a sale was somehow already recorded even
  // though the item status guard above didn't catch it.
  const { data: existingSale } = await supabase
    .from("sales")
    .select("id")
    .eq("item_id", itemId)
    .maybeSingle();

  if (!existingSale && winningListing) {
    await supabase.from("sales").insert({
      item_id: itemId,
      listing_id: winningListing.id,
      platform: soldOnPlatform,
      sale_price: salePrice,
    });

    await supabase.from("listings").update({ status: "sold" }).eq("id", winningListing.id);
  }

  const { data: listings } = await supabase
    .from("listings")
    .select("id, platform, external_id")
    .eq("item_id", itemId)
    .eq("status", "active")
    .neq("platform", soldOnPlatform);

  for (const listing of listings ?? []) {
    await getAdapter(listing.platform).delist(listing.external_id ?? listing.id);
    await supabase.from("listings").update({ status: "delisted" }).eq("id", listing.id);
  }

  await supabase.from("pipeline_events").insert({
    item_id: itemId,
    from_status: item.status,
    to_status: "sold",
    actor: "system",
  });

  await supabase.from("items").update({ status: "sold" }).eq("id", itemId);

  await supabase.rpc("pgmq_send", {
    queue_name: "notify-status-change",
    message: { itemId, toStatus: "sold" },
  });

  return new Response(
    JSON.stringify({ ok: true, delisted: listings?.length ?? 0, sold: true }),
    { status: 200 }
  );
});
