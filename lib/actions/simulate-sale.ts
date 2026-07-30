"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QUEUE_NAMES } from "@/lib/queue-names";

// Demo-only action: triggers the exact same path a real marketplace webhook
// would (app/api/webhooks/[platform]/route.ts is the reference implementation
// this reuses the enqueue call from) - not a shortcut that writes to `sales`
// directly, so it exercises the real webhook-ingest -> delist-everywhere
// chain end to end. Only ever shown in the UI for platforms running in mock
// mode (see lib/platform-adapter.ts's getAdapterMode).
export async function simulateSale(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const platform = String(formData.get("platform") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/items");

  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("price")
    .eq("item_id", itemId)
    .eq("platform", platform)
    .eq("status", "active")
    .single();

  if (!listing) {
    redirect(`${redirectTo}?error=No%20active%20listing%20on%20that%20platform`);
  }

  const { error } = await supabase.rpc("pgmq_send", {
    queue_name: QUEUE_NAMES.webhookIngest,
    message: {
      platform,
      payload: { event: "sale", itemId, salePrice: listing.price },
      receivedAt: new Date().toISOString(),
    },
  });

  if (error) {
    redirect(`${redirectTo}?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`${redirectTo}?simulated=1`);
}
