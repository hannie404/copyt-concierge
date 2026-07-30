import { Card } from "@/components/Card";
import { StatBlock } from "@/components/StatBlock";
import { createClient } from "@/lib/supabase/server";

const SLA_THRESHOLD_HOURS = 48;

async function getAnalytics() {
  const supabase = await createClient();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const slaThreshold = new Date(Date.now() - SLA_THRESHOLD_HOURS * 60 * 60 * 1000).toISOString();

  const [{ data: items }, { data: recentSales }, { data: breaching }] = await Promise.all([
    supabase.from("items").select("status"),
    supabase.from("sales").select("sale_price").gte("sold_at", thirtyDaysAgo),
    supabase
      .from("items")
      .select("id")
      .in("status", ["received", "authenticating"])
      .lt("intake_at", slaThreshold),
  ]);

  const countByStatus = (status: string) => (items ?? []).filter((i) => i.status === status).length;

  const throughput = [
    { stage: "Received", value: countByStatus("received") },
    { stage: "Authenticating", value: countByStatus("authenticating") },
    { stage: "Photographed", value: countByStatus("photographed") },
    { stage: "Listed", value: countByStatus("listed") },
    { stage: "Sold (30d)", value: (recentSales ?? []).length },
  ];

  const grossSales = (recentSales ?? []).reduce((sum, s) => sum + Number(s.sale_price), 0);

  return { throughput, slaBreaches: (breaching ?? []).length, grossSales };
}

export default async function AdminAnalyticsPage() {
  const { throughput, slaBreaches, grossSales } = await getAnalytics();

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Analytics</h1>

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:flex sm:flex-wrap sm:gap-0 sm:divide-x sm:divide-brand-grayPill">
        {throughput.map((stage, i) => (
          <div
            key={stage.stage}
            className={i === 0 ? "sm:pr-10" : i === throughput.length - 1 ? "sm:pl-10" : "sm:px-10"}
          >
            <StatBlock value={String(stage.value)} label={stage.stage} />
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <p className="font-display text-lg font-bold text-brand-black">SLA breaches</p>
          <p className="mt-4 font-display text-3xl font-extrabold text-status-flagged">{slaBreaches}</p>
          <p className="mt-1 text-sm text-brand-gray">
            Items past the {SLA_THRESHOLD_HOURS}h authentication SLA, currently.
          </p>
        </Card>
        <Card>
          <p className="font-display text-lg font-bold text-brand-black">Gross sales (30d)</p>
          <p className="mt-4 font-display text-3xl font-extrabold text-brand-black">
            ${grossSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-sm text-brand-gray">
            Total sale price across all platforms. Commission/take-rate reporting isn&apos;t
            available yet — no pricing tier data exists in the schema.
          </p>
        </Card>
      </div>
    </div>
  );
}
