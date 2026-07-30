"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QUEUE_NAMES } from "@/lib/queue-names";

async function transitionItem(formData: FormData, toStatus: "photographed" | "flagged") {
  const itemId = String(formData.get("itemId") ?? "");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: item } = await supabase
    .from("items")
    .select("status")
    .eq("id", itemId)
    .single();

  if (!item) redirect(`/ops/authentication?error=Item%20not%20found`);

  // Idempotency: only act if the item is still awaiting review - a
  // duplicate form submit shouldn't re-flag an already-approved item.
  if (item.status !== "received" && item.status !== "authenticating") {
    redirect(`/ops/authentication?error=Item%20already%20reviewed`);
  }

  await supabase.from("pipeline_events").insert({
    item_id: itemId,
    from_status: item.status,
    to_status: toStatus,
    actor: user.id,
  });

  await supabase.from("items").update({ status: toStatus }).eq("id", itemId);

  await supabase.rpc("pgmq_send", {
    queue_name: QUEUE_NAMES.notifyStatusChange,
    message: { itemId, toStatus },
  });

  redirect("/ops/authentication?reviewed=1");
}

export async function approveItem(formData: FormData) {
  await transitionItem(formData, "photographed");
}

export async function flagItem(formData: FormData) {
  await transitionItem(formData, "flagged");
}
