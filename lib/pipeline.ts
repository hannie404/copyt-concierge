import type { ItemStatus, Platform } from "@/lib/queue-names";

// Real domain constants (not mock data) - the canonical pipeline stage order
// and platform display labels, shared by both real-data and still-mocked pages.

export const ITEM_STATUS_ORDER: ItemStatus[] = [
  "received",
  "authenticating",
  "photographed",
  "listed",
  "sold",
  "paid",
];

export const PLATFORM_LABELS: Record<Platform, string> = {
  stockx: "StockX",
  ebay: "eBay",
  whatnot: "Whatnot",
  pos: "POS",
};
