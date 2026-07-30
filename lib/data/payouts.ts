import { createClient } from "@/lib/supabase/server";

export type PortalPayout = {
  id: string;
  amount: number;
  batchId: string;
  status: string;
  paidAt: string | null;
};

export async function getPayoutsForCurrentUser(): Promise<PortalPayout[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("payouts")
    .select("id, amount, batch_id, status, paid_at")
    .eq("user_id", user.id)
    .order("paid_at", { ascending: false, nullsFirst: true });

  if (error || !data) return [];

  return data.map((payout) => ({
    id: payout.id,
    amount: payout.amount,
    batchId: payout.batch_id,
    status: payout.status,
    paidAt: payout.paid_at,
  }));
}
