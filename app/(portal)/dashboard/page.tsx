import Link from "next/link";
import { StatBlock } from "@/components/StatBlock";
import { Card } from "@/components/Card";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/Button";
import { getItemsForCurrentUser, getDashboardStats } from "@/lib/data/items";

export default async function DashboardPage() {
  const items = await getItemsForCurrentUser();
  const stats = await getDashboardStats(items);
  const recent = items.slice(0, 5);

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

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:flex sm:flex-wrap sm:gap-0 sm:divide-x sm:divide-brand-grayPill">
        <div className="sm:pr-10">
          <StatBlock value={String(stats.inTransit)} label="In transit" />
        </div>
        <div className="sm:px-10">
          <StatBlock value={String(stats.listed)} label="Listed" />
        </div>
        <div className="sm:px-10">
          <StatBlock value={String(stats.sold)} label="Sold" />
        </div>
        <div className="sm:pl-10">
          <StatBlock value={String(stats.paid)} label="Paid out" />
        </div>
      </div>

      <Card className="mt-10">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-bold text-brand-black">Recent items</p>
          <Link href="/items" className="text-sm font-medium text-brand-magenta">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-brand-gray">No items yet.</p>
            <Link href="/intake/new" className="mt-3 inline-block">
              <Button variant="outline" arrow>
                Start your first intake
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-brand-grayPill">
            {recent.map((item) => (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3 text-sm hover:text-brand-magenta"
              >
                <span className="text-brand-black">{item.description}</span>
                <div className="flex items-center gap-6">
                  <span className="text-brand-gray">
                    {item.estimatedValue != null ? `$${item.estimatedValue.toLocaleString()}` : "—"}
                  </span>
                  <StatusPill status={item.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
