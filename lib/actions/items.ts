"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QUEUE_NAMES } from "@/lib/queue-names";

// Real barcodes are physically assigned when ops staff scan the item in at
// /ops/intake (Phase 11) - this placeholder lets a consignor declare an item
// before it physically arrives, matching SPEC.md's /intake/new description.
function generatePlaceholderCode() {
  return `PENDING-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function createIntake(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const description = String(formData.get("description") ?? "").trim();
  const estimatedValueRaw = formData.get("estimatedValue");
  const estimatedValue = estimatedValueRaw ? Number(estimatedValueRaw) : null;

  if (!description) {
    redirect("/intake/new?error=Item%20description%20is%20required");
  }

  const code = generatePlaceholderCode();

  const { data: inserted, error } = await supabase
    .from("items")
    .insert({
      user_id: user.id,
      sku: code,
      barcode: code,
      description,
      status: "received",
      estimated_value: estimatedValue,
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/intake/new?error=${encodeURIComponent(error.message)}`);
  }

  // Kicks off the stub authentication-score job (Phase 9), which advances
  // the item into the authenticating queue once scored.
  await supabase.rpc("pgmq_send", {
    queue_name: QUEUE_NAMES.authScore,
    message: { itemId: inserted.id },
  });

  redirect("/items");
}
