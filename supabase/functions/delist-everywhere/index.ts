// Supabase Edge Function: the trust-critical job. When an item sells on one
// platform, delist it everywhere else. MUST be idempotent - safe to replay
// without double-delisting or double-notifying. See SPEC.md §3.4, §6.

import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async () => {
  const { data, error } = await supabase
    .schema("pgmq_public")
    .rpc("pop", { queue_name: "delist-everywhere" });

  if (error || !data?.length) {
    return new Response(JSON.stringify({ ok: true, processed: 0 }), { status: 200 });
  }

  const { message } = data[0];
  const { itemId, soldOnPlatform } = message as {
    itemId: string;
    soldOnPlatform: string;
  };

  // Idempotency: only act on listings that are still "active" - replaying
  // this message after listings are already "delisted" is a no-op.
  const { data: listings } = await supabase
    .from("listings")
    .select("id, platform")
    .eq("item_id", itemId)
    .eq("status", "active")
    .neq("platform", soldOnPlatform);

  for (const listing of listings ?? []) {
    // TODO: call the actual platform API to delist `listing.id` on `listing.platform`.
    await supabase.from("listings").update({ status: "delisted" }).eq("id", listing.id);

    await supabase.schema("pgmq_public").rpc("send", {
      queue_name: "notify-status-change",
      message: { itemId, toStatus: "sold" },
    });
  }

  return new Response(JSON.stringify({ ok: true, delisted: listings?.length ?? 0 }), {
    status: 200,
  });
});
