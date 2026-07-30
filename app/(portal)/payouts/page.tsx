import { Card } from "@/components/Card";
import { StatBlock } from "@/components/StatBlock";
import { getPayoutsForCurrentUser } from "@/lib/data/payouts";

export default async function PayoutsPage() {
  const payouts = await getPayoutsForCurrentUser();
  const pending = payouts.filter((p) => p.status === "pending");
  const pendingTotal = pending.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Payouts</h1>

      <div className="mt-8 flex flex-wrap divide-x divide-brand-grayPill">
        <div className="pr-10">
          <StatBlock value="Weekly" label="Payout schedule" />
        </div>
        <div className="px-10">
          <StatBlock value={`$${pendingTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} label="Pending amount" />
        </div>
        <div className="pl-10">
          <StatBlock value="Not connected" label="Payout method" />
        </div>
      </div>

      <Card className="mt-10">
        <p className="font-display text-lg font-bold text-brand-black">Earnings history</p>
        {payouts.length === 0 ? (
          <p className="mt-4 text-sm text-brand-gray">No payouts yet.</p>
        ) : (
          <div className="mt-4 divide-y divide-brand-grayPill">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-brand-black">{payout.paidAt ? payout.paidAt.slice(0, 10) : "Pending"}</span>
                <span className="text-brand-gray">Batch {payout.batchId}</span>
                <span className={payout.status === "paid" ? "text-status-paid" : "text-brand-gray"}>
                  {payout.status}
                </span>
                <span className="font-medium text-brand-black">
                  ${payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
