"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { StatusPill } from "@/components/StatusPill";
import { MOCK_ITEMS, ITEM_STATUS_ORDER } from "@/lib/mock-data";
import type { ItemStatus } from "@/lib/queue-names";

export default function ItemsPage() {
  const [filter, setFilter] = useState<ItemStatus | "all">("all");

  const items = MOCK_ITEMS.filter((item) => filter === "all" || item.status === filter);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Items</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors duration-200 ${
            filter === "all" ? "bg-brand-magenta text-white" : "bg-brand-grayPill text-brand-black"
          }`}
        >
          All
        </button>
        {ITEM_STATUS_ORDER.map((status) => (
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
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/items/${item.id}`}
              className="flex items-center justify-between py-3 text-sm hover:text-brand-magenta"
            >
              <div>
                <span className="text-brand-black">{item.name}</span>
                <span className="ml-2 text-xs text-brand-gray">{item.sku}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-brand-gray">${item.price.toLocaleString()}</span>
                <StatusPill status={item.status} />
              </div>
            </Link>
          ))}
          {items.length === 0 && (
            <p className="py-6 text-center text-sm text-brand-gray">No items with this status.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
