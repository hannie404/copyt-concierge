// Supabase Edge Function: pops from the webhook-ingest pgmq queue (fed by
// app/api/webhooks/[platform]/route.ts), parses the payload, and - for a
// "sold" event - enqueues to delist-everywhere. See SPEC.md §6, Phase 7.
//
// Normalized interim event contract (no real StockX/eBay/Whatnot sandbox docs
// exist yet, so this stands in until Phase 7+ gets real credentials):
//   payload = { event: "sale", itemId: string, salePrice: number }

import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async () => {
  const { data, error } = await supabase.rpc("pgmq_pop", { queue_name: "webhook-ingest" });

  if (error) {
    console.error("[webhook-ingest] pop failed", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
  }
  if (!data?.length) {
    return new Response(JSON.stringify({ ok: true, processed: 0 }), { status: 200 });
  }

  const { message } = data[0];
  const { platform, payload } = message as {
    platform: string;
    payload: Record<string, unknown>;
  };

  if (payload?.event === "sale") {
    await supabase.rpc("pgmq_send", {
      queue_name: "delist-everywhere",
      message: {
        itemId: payload.itemId,
        soldOnPlatform: platform,
        salePrice: payload.salePrice,
      },
    });
  }

  return new Response(JSON.stringify({ ok: true, processed: 1 }), { status: 200 });
});
