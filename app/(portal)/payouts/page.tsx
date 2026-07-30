import { Card } from "@/components/Card";
import { StatBlock } from "@/components/StatBlock";
import { Pagination, PAGE_SIZE } from "@/components/Pagination";
import { getPayoutsForCurrentUser } from "@/lib/data/payouts";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

async function getPayoutMethodLabel() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "Not connected";

  const { data: profile } = await supabase
    .from("profiles")
    .select("payout_method_id")
    .eq("id", user.id)
    .single();

  if (!profile?.payout_method_id) return "Not connected";

  const account = await stripe.accounts.retrieve(profile.payout_method_id);
  return account.payouts_enabled ? "Connected" : "Onboarding incomplete";
}

export default async function PayoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const allPayouts = await getPayoutsForCurrentUser();
  const pending = allPayouts.filter((p) => p.status === "pending");
  const pendingTotal = pending.reduce((sum, p) => sum + p.amount, 0);
  const payoutMethodLabel = await getPayoutMethodLabel();
  const totalPages = Math.max(1, Math.ceil(allPayouts.length / PAGE_SIZE));
  const payouts = allPayouts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Payouts</h1>

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:flex sm:flex-wrap sm:gap-0 sm:divide-x sm:divide-brand-grayPill">
        <div className="sm:pr-10">
          <StatBlock value="Weekly" label="Payout schedule" />
        </div>
        <div className="sm:px-10">
          <StatBlock value={`$${pendingTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} label="Pending amount" />
        </div>
        <div className="sm:pl-10">
          <StatBlock value={payoutMethodLabel} label="Payout method" />
        </div>
      </div>

      <Card className="mt-10">
        <p className="font-display text-lg font-bold text-brand-black">Earnings history</p>
        {payouts.length === 0 ? (
          <p className="mt-4 text-sm text-brand-gray">No payouts yet.</p>
        ) : (
          <div className="mt-4 divide-y divide-brand-grayPill">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-black">{payout.paidAt ? payout.paidAt.slice(0, 10) : "Pending"}</span>
                    <span className={payout.status === "paid" ? "text-status-paid" : "text-brand-gray"}>
                      {payout.status}
                    </span>
                  </div>
                  <p className="truncate text-xs text-brand-gray">Batch {payout.batchId}</p>
                </div>
                <span className="shrink-0 font-medium text-brand-black">
                  ${payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/payouts" />
    </div>
  );
}
