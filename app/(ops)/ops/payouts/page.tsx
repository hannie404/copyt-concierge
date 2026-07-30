import { Card } from "@/components/Card";
import { StatBlock } from "@/components/StatBlock";
import { Pagination, PAGE_SIZE } from "@/components/Pagination";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABEL: Record<string, string> = {
  paid: "Paid",
  pending: "Pending",
  blocked: "Blocked — no payout account",
  failed: "Failed",
};

const STATUS_COLOR: Record<string, string> = {
  paid: "text-status-paid",
  pending: "text-status-authenticating",
  blocked: "text-status-flagged",
  failed: "text-status-flagged",
};

async function getStats() {
  const supabase = await createClient();
  const { data } = await supabase.from("payouts").select("amount, status");

  const pendingCount = (data ?? []).filter((p) => p.status === "pending" || p.status === "blocked").length;
  const paidTotal = (data ?? [])
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return { pendingCount, paidTotal };
}

async function getPayouts(page: number) {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count } = await supabase
    .from("payouts")
    .select("id, amount, status, paid_at, error, profiles(name)", { count: "exact" })
    .order("paid_at", { ascending: false, nullsFirst: false })
    .range(from, to);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return {
    payouts: (data ?? []).map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      status: p.status,
      paidAt: p.paid_at as string | null,
      error: p.error as string | null,
      consignor: (p.profiles as unknown as { name: string | null } | null)?.name ?? "Unknown",
    })),
    totalPages,
  };
}

export default async function OpsPayoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const { pendingCount, paidTotal } = await getStats();
  const { payouts, totalPages } = await getPayouts(currentPage);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Payouts</h1>
      <p className="mt-1 text-sm text-brand-gray">
        Weekly batch, wired to real Stripe Connect transfers (test mode).
      </p>

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:flex sm:flex-wrap sm:gap-0 sm:divide-x sm:divide-brand-grayPill">
        <div className="sm:pr-10">
          <StatBlock value={`$${paidTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} label="Paid out" />
        </div>
        <div className="sm:pl-10">
          <StatBlock value={String(pendingCount)} label="Awaiting payout" />
        </div>
      </div>

      <Card className="mt-8">
        <div className="divide-y divide-brand-grayPill">
          {payouts.map((payout) => (
            <div key={payout.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-4 text-sm">
              <div className="min-w-0">
                <p className="font-medium text-brand-black">{payout.consignor}</p>
                <p className="text-xs text-brand-gray">
                  {payout.paidAt ? new Date(payout.paidAt).toLocaleDateString() : "Not yet paid"}
                  {payout.error && ` · ${payout.error}`}
                </p>
              </div>
              <span className={STATUS_COLOR[payout.status] ?? "text-brand-gray"}>
                {STATUS_LABEL[payout.status] ?? payout.status}
              </span>
              <span className="font-medium text-brand-black">
                ${payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
          {payouts.length === 0 && (
            <p className="py-6 text-center text-sm text-brand-gray">No payouts yet.</p>
          )}
        </div>
      </Card>

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/ops/payouts" />
    </div>
  );
}
