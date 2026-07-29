import { Card } from "@/components/Card";
import { StatBlock } from "@/components/StatBlock";

const BATCHES = [
  { id: "batch_318", runDate: "2026-07-24", recipients: 38, total: 24810.5, status: "Completed" },
  { id: "batch_305", runDate: "2026-07-17", recipients: 31, total: 18220.0, status: "Completed" },
  { id: "batch_292", runDate: "2026-07-10", recipients: 29, total: 21540.75, status: "Completed" },
];

export default function OpsPayoutsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Payout batches</h1>

      <div className="mt-8 flex flex-wrap divide-x divide-brand-grayPill">
        <div className="pr-10">
          <StatBlock value="Aug 3" label="Next batch run" />
        </div>
        <div className="pl-10">
          <StatBlock value="41" label="Consignors queued" />
        </div>
      </div>

      <Card className="mt-8">
        <div className="divide-y divide-brand-grayPill">
          {BATCHES.map((batch) => (
            <div key={batch.id} className="flex items-center justify-between py-4 text-sm">
              <div>
                <p className="font-medium text-brand-black">{batch.runDate}</p>
                <p className="text-xs text-brand-gray">{batch.recipients} recipients</p>
              </div>
              <span className="text-status-paid">{batch.status}</span>
              <span className="font-medium text-brand-black">
                ${batch.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
