import { createClient } from "@/lib/supabase/server";
import type { ItemStatus } from "@/lib/queue-names";

export type PortalItem = {
  id: string;
  sku: string;
  barcode: string;
  description: string;
  status: ItemStatus;
  intakeAt: string;
  estimatedValue: number | null;
};

export type PortalItemWithListings = PortalItem & {
  listings: { platform: string; status: string }[];
};

// RLS already scopes every query below to auth.uid() - the explicit .eq calls
// are for query clarity/index use, not a substitute for the policy.

export async function getItemsForCurrentUser(): Promise<PortalItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("items")
    .select("id, sku, barcode, description, status, intake_at, estimated_value")
    .eq("user_id", user.id)
    .order("intake_at", { ascending: false });

  if (error || !data) return [];

  return data.map((item) => ({
    id: item.id,
    sku: item.sku,
    barcode: item.barcode,
    description: item.description,
    status: item.status,
    intakeAt: item.intake_at,
    estimatedValue: item.estimated_value,
  }));
}

export async function getItemById(id: string): Promise<PortalItemWithListings | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items")
    .select(
      "id, sku, barcode, description, status, intake_at, estimated_value, listings(platform, status)"
    )
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    sku: data.sku,
    barcode: data.barcode,
    description: data.description,
    status: data.status,
    intakeAt: data.intake_at,
    estimatedValue: data.estimated_value,
    listings: (data.listings ?? []).filter((l) => l.status === "active"),
  };
}

export async function getDashboardStats(items: PortalItem[]) {
  const inTransit = items.filter((i) => i.status === "received" || i.status === "authenticating").length;
  const listed = items.filter((i) => i.status === "listed").length;
  const sold = items.filter((i) => i.status === "sold").length;
  const paid = items.filter((i) => i.status === "paid").length;
  return { inTransit, listed, sold, paid };
}
