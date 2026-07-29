import { Card } from "@/components/Card";
import { StatBlock } from "@/components/StatBlock";
import { MOCK_PAYOUTS } from "@/lib/mock-data";

export default function PayoutsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Payouts</h1>

      <div className="mt-8 flex flex-wrap divide-x divide-brand-grayPill">
        <div className="pr-10">
          <StatBlock value="Aug 3" label="Next payout date" />
        </div>
        <div className="px-10">
          <StatBlock value="$1,842.00" label="Pending amount" />
        </div>
        <div className="pl-10">
          <StatBlock value="Bank •••• 4821" label="Payout method" />
        </div>
      </div>

      <Card className="mt-10">
        <p className="font-display text-lg font-bold text-brand-black">Earnings history</p>
        <div className="mt-4 divide-y divide-brand-grayPill">
          {MOCK_PAYOUTS.map((payout) => (
            <div key={payout.id} className="flex items-center justify-between py-3 text-sm">
              <span className="text-brand-black">{payout.date}</span>
              <span className="text-brand-gray">{payout.method}</span>
              <span className="text-status-paid">{payout.status}</span>
              <span className="font-medium text-brand-black">
                ${payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
