// Supabase Edge Function: pops from the webhook-ingest pgmq queue (fed by
// app/api/webhooks/[platform]/route.ts), parses the payload, and - for a
// "sold" event - enqueues to delist-everywhere. See SPEC.md §6, BUILD_PROMPTS.md Phase 7.

import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async () => {
  const { data, error } = await supabase
    .schema("pgmq_public")
    .rpc("pop", { queue_name: "webhook-ingest" });

  if (error || !data?.length) {
    return new Response(JSON.stringify({ ok: true, processed: 0 }), { status: 200 });
  }

  const { message } = data[0];
  const { platform, payload } = message as {
    platform: string;
    payload: Record<string, unknown>;
  };

  // TODO: map each platform's webhook shape to a normalized event.
  // For a sale event, enqueue delist-everywhere with the item id + platform sold on.
  if (payload?.event === "sale") {
    await supabase.schema("pgmq_public").rpc("send", {
      queue_name: "delist-everywhere",
      message: { itemId: payload.itemId, soldOnPlatform: platform },
    });
  }

  return new Response(JSON.stringify({ ok: true, processed: 1 }), { status: 200 });
});
