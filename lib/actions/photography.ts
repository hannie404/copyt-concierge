"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Uploads to the item-photos bucket under the item's own consignor - RLS
// policy "item-photos: staff full access" (00004_storage.sql) already covers
// this for the signed-in staff session, no service role needed. The upload
// itself is what fires Phase 9's image-enhance Storage trigger.
export async function uploadItemPhoto(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const file = formData.get("photo") as File | null;

  if (!file || file.size === 0) redirect("/ops/photography?error=No%20file%20selected");

  const supabase = await createClient();
  const { data: item } = await supabase.from("items").select("user_id").eq("id", itemId).single();
  if (!item) redirect("/ops/photography?error=Item%20not%20found");

  const path = `${item.user_id}/${itemId}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("item-photos").upload(path, file, {
    contentType: file.type,
  });

  if (error) redirect(`/ops/photography?error=${encodeURIComponent(error.message)}`);

  redirect("/ops/photography?uploaded=1");
}
