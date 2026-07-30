"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/Button";
import { ITEM_STATUS_ORDER } from "@/lib/pipeline";
import type { PortalItem } from "@/lib/data/items";
import type { ItemStatus } from "@/lib/queue-names";

export function ItemsFilterClient({ items }: { items: PortalItem[] }) {
  const [filter, setFilter] = useState<ItemStatus | "all">("all");

  const filtered = items.filter((item) => filter === "all" || item.status === filter);

  if (items.length === 0) {
    return (
      <Card className="mt-6">
        <div className="py-10 text-center">
          <p className="text-sm text-brand-gray">No items yet.</p>
          <Link href="/intake/new" className="mt-3 inline-block">
            <Button variant="outline" arrow>
              Start your first intake
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors duration-200 ${
            filter === "all" ? "bg-brand-magenta text-white" : "bg-brand-grayPill text-brand-black"
          }`}
        >
          All
        </button>
        {ITEM_STATUS_ORDER.concat("flagged").map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors duration-200 ${
              filter === status ? "bg-brand-magenta text-white" : "bg-brand-grayPill text-brand-black"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <Card className="mt-6">
        <div className="divide-y divide-brand-grayPill">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/items/${item.id}`}
              className="flex items-center justify-between py-3 text-sm hover:text-brand-magenta"
            >
              <div>
                <span className="text-brand-black">{item.description}</span>
                <span className="ml-2 text-xs text-brand-gray">{item.sku}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-brand-gray">
                  {item.estimatedValue != null ? `$${item.estimatedValue.toLocaleString()}` : "—"}
                </span>
                <StatusPill status={item.status} />
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-brand-gray">No items with this status.</p>
          )}
        </div>
      </Card>
    </>
  );
}
