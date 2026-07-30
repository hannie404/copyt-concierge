// Supabase Edge Function: consumes auth-score (enqueued by createIntake at
// intake time - lib/actions/items.ts). Computes a stub authentication score
// (real ML scoring is out of scope for MVP, per BUILD_PROMPTS.md Phase 9)
// so a human reviewer on /ops/authentication has something to look at, and
// advances a fresh item into the authenticating stage so it actually shows
// up in that queue. See SPEC.md §6.

import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Same deterministic-ish hash technique as MockPlatformAdapter.getComps, so
// repeated scoring for the same SKU looks consistent in a demo.
function hashSku(sku: string): number {
  let hash = 0;
  for (let i = 0; i < sku.length; i++) {
    hash = (hash * 31 + sku.charCodeAt(i)) >>> 0;
  }
  return hash;
}

Deno.serve(async () => {
  const { data, error } = await supabase.rpc("pgmq_pop", { queue_name: "auth-score" });

  if (error) {
    console.error("[auth-score] pop failed", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
  }
  if (!data?.length) {
    return new Response(JSON.stringify({ ok: true, processed: 0 }), { status: 200 });
  }

  const { message } = data[0];
  const { itemId } = message as { itemId: string };

  const { data: item } = await supabase
    .from("items")
    .select("sku, status")
    .eq("id", itemId)
    .single();

  if (!item) {
    await supabase.from("queue_job_log").insert({
      queue_name: "auth-score",
      job_type: "auth-score",
      item_id: itemId,
      status: "failed",
      error: "item not found",
    });
    return new Response(JSON.stringify({ ok: true, skipped: "item not found" }), { status: 200 });
  }

  const score = Math.round((40 + (hashSku(item.sku) % 55)) * 100) / 100;

  await supabase.from("auth_scores").insert({ item_id: itemId, score });

  // Idempotency: only advance the pipeline if this item is still at its
  // pre-review stage - a replayed message shouldn't move an item that's
  // already been reviewed (e.g. approved/flagged) backwards or sideways.
  if (item.status === "received") {
    await supabase.from("pipeline_events").insert({
      item_id: itemId,
      from_status: "received",
      to_status: "authenticating",
      actor: "system",
    });
    await supabase.from("items").update({ status: "authenticating" }).eq("id", itemId);
    await supabase.rpc("pgmq_send", {
      queue_name: "notify-status-change",
      message: { itemId, toStatus: "authenticating" },
    });
  }

  await supabase.from("queue_job_log").insert({
    queue_name: "auth-score",
    job_type: "auth-score",
    item_id: itemId,
    status: "scored",
  });

  return new Response(JSON.stringify({ ok: true, processed: 1, score }), { status: 200 });
});
