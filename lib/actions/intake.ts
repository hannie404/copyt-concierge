"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Items are created by the consignor's own intake declaration
// (lib/actions/items.ts, at status 'received'). This looks the item back up
// by whatever code is physically on the package (barcode or the placeholder
// sku), for staff to confirm the shipment matches a real declared item.
export async function lookupItem(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim();
  if (!code) redirect("/ops/intake");

  const supabase = await createClient();
  const { data: byBarcode } = await supabase.from("items").select("id").eq("barcode", code).maybeSingle();
  const item = byBarcode ?? (await supabase.from("items").select("id").eq("sku", code).maybeSingle()).data;

  if (!item) redirect(`/ops/intake?notfound=1`);

  redirect(`/ops/intake?found=${item.id}`);
}
