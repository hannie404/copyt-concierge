import Link from "next/link";
import { StatBlock } from "@/components/StatBlock";
import { Card } from "@/components/Card";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/Button";
import { MOCK_DASHBOARD_STATS, MOCK_ITEMS } from "@/lib/mock-data";

export default function DashboardPage() {
  const recent = MOCK_ITEMS.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-brand-black">Dashboard</h1>
        <Link href="/intake/new">
          <Button variant="primary" arrow>
            New intake
          </Button>
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap divide-x divide-brand-grayPill">
        <div className="pr-10">
          <StatBlock value={String(MOCK_DASHBOARD_STATS.inTransit)} label="In transit" />
        </div>
        <div className="px-10">
          <StatBlock value={String(MOCK_DASHBOARD_STATS.listed)} label="Listed" />
        </div>
        <div className="px-10">
          <StatBlock value={String(MOCK_DASHBOARD_STATS.sold)} label="Sold" />
        </div>
        <div className="pl-10">
          <StatBlock value={String(MOCK_DASHBOARD_STATS.paid)} label="Paid out" />
        </div>
      </div>

      <Card className="mt-10">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-bold text-brand-black">Recent items</p>
          <Link href="/items" className="text-sm font-medium text-brand-magenta">
            View all
          </Link>
        </div>

        <div className="mt-4 divide-y divide-brand-grayPill">
          {recent.map((item) => (
            <Link
              key={item.id}
              href={`/items/${item.id}`}
              className="flex items-center justify-between py-3 text-sm hover:text-brand-magenta"
            >
              <span className="text-brand-black">{item.name}</span>
              <div className="flex items-center gap-6">
                <span className="text-brand-gray">${item.price.toLocaleString()}</span>
                <StatusPill status={item.status} />
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
