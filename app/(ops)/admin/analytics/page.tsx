import { Card } from "@/components/Card";
import { StatBlock } from "@/components/StatBlock";

const THROUGHPUT = [
  { stage: "Received", value: "38" },
  { stage: "Authenticating", value: "12" },
  { stage: "Photographed", value: "9" },
  { stage: "Listed", value: "156" },
  { stage: "Sold (30d)", value: "47" },
];

export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Analytics</h1>

      <div className="mt-8 flex flex-wrap divide-x divide-brand-grayPill">
        {THROUGHPUT.map((stage, i) => (
          <div
            key={stage.stage}
            className={i === 0 ? "pr-10" : i === THROUGHPUT.length - 1 ? "pl-10" : "px-10"}
          >
            <StatBlock value={stage.value} label={stage.stage} />
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <p className="font-display text-lg font-bold text-brand-black">SLA breaches</p>
          <p className="mt-4 font-display text-3xl font-extrabold text-status-flagged">3</p>
          <p className="mt-1 text-sm text-brand-gray">Items past their pipeline-stage SLA this week.</p>
        </Card>
        <Card>
          <p className="font-display text-lg font-bold text-brand-black">Revenue (30d)</p>
          <p className="mt-4 font-display text-3xl font-extrabold text-brand-black">$94,529</p>
          <p className="mt-1 text-sm text-brand-gray">Total commission earned across all platforms.</p>
        </Card>
      </div>
    </div>
  );
}
