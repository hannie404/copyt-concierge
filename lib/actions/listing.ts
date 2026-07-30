"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdapter } from "@/lib/platform-adapter";
import { QUEUE_NAMES } from "@/lib/queue-names";
import type { Platform } from "@/lib/queue-names";

const LISTABLE_PLATFORMS: Platform[] = ["stockx", "ebay", "whatnot"];

export async function publishListing(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const platforms = LISTABLE_PLATFORMS.filter((p) => formData.get(`platform_${p}`) === "on");

  if (!price || price <= 0) redirect("/ops/listing?error=Enter%20a%20valid%20price");
  if (platforms.length === 0) redirect("/ops/listing?error=Select%20at%20least%20one%20platform");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: item } = await supabase.from("items").select("sku, description, status").eq("id", itemId).single();

  if (!item || item.status !== "photographed") {
    redirect("/ops/listing?error=Item%20not%20ready%20to%20list");
  }

  for (const platform of platforms) {
    const { externalId } = await getAdapter(platform).publish({ sku: item!.sku, description: item!.description, price });
    await supabase.from("listings").insert({
      item_id: itemId,
      platform,
      price,
      status: "active",
      external_id: externalId,
    });
  }

  await supabase.from("pipeline_events").insert({
    item_id: itemId,
    from_status: "photographed",
    to_status: "listed",
    actor: user.id,
  });

  await supabase.from("items").update({ status: "listed" }).eq("id", itemId);

  await supabase.rpc("pgmq_send", {
    queue_name: QUEUE_NAMES.notifyStatusChange,
    message: { itemId, toStatus: "listed" },
  });

  redirect("/ops/listing?published=1");
}
