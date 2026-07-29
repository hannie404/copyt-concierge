import type { ItemStatus, Platform } from "@/lib/queue-names";

// Static mock data for Phase 2-4 frontend pages. No Supabase — shaped to match
// the eventual real schema (SPEC.md §5) so wiring in Phase 6 is a drop-in swap.

export type MockItem = {
  id: string;
  sku: string;
  name: string;
  status: ItemStatus;
  intakeAt: string;
  price: number;
  platforms: Platform[];
};

export const MOCK_ITEMS: MockItem[] = [
  { id: "itm_1042", sku: "SKU-1042", name: "Nike Air Jordan 4 'Retro'", status: "listed", intakeAt: "2026-07-18", price: 285, platforms: ["stockx", "ebay"] },
  { id: "itm_1041", sku: "SKU-1041", name: "Supreme Box Logo Hoodie", status: "sold", intakeAt: "2026-07-15", price: 640, platforms: ["ebay", "whatnot"] },
  { id: "itm_1040", sku: "SKU-1040", name: "Rolex Datejust 36mm", status: "authenticating", intakeAt: "2026-07-22", price: 8200, platforms: [] },
  { id: "itm_1039", sku: "SKU-1039", name: "Yeezy Boost 350 V2", status: "photographed", intakeAt: "2026-07-20", price: 195, platforms: [] },
  { id: "itm_1038", sku: "SKU-1038", name: "Chrome Hearts Ring", status: "flagged", intakeAt: "2026-07-21", price: 410, platforms: [] },
  { id: "itm_1037", sku: "SKU-1037", name: "Louis Vuitton Keepall 50", status: "paid", intakeAt: "2026-07-02", price: 1150, platforms: ["ebay"] },
  { id: "itm_1036", sku: "SKU-1036", name: "Travis Scott x Jordan 1 Low", status: "received", intakeAt: "2026-07-27", price: 720, platforms: [] },
  { id: "itm_1035", sku: "SKU-1035", name: "Cartier Love Bracelet", status: "listed", intakeAt: "2026-07-19", price: 5400, platforms: ["stockx"] },
];

export const ITEM_STATUS_ORDER: ItemStatus[] = [
  "received",
  "authenticating",
  "photographed",
  "listed",
  "sold",
  "paid",
];

export const MOCK_DASHBOARD_STATS = {
  inTransit: 3,
  listed: 12,
  sold: 47,
  paid: 44,
};

export const MOCK_PAYOUTS = [
  { id: "po_2201", date: "2026-07-24", amount: 1284.5, method: "Bank •••• 4821", status: "Paid" },
  { id: "po_2189", date: "2026-07-17", amount: 962.0, method: "Bank •••• 4821", status: "Paid" },
  { id: "po_2177", date: "2026-07-10", amount: 2110.75, method: "Bank •••• 4821", status: "Paid" },
];

export const MOCK_SALES = [
  { id: "sale_881", item: "Supreme Box Logo Hoodie", platform: "eBay" as const, price: 640, soldAt: "2026-07-29 14:02", delisted: ["StockX", "Whatnot", "POS"] },
  { id: "sale_880", item: "Air Jordan 1 Chicago", platform: "StockX" as const, price: 410, soldAt: "2026-07-29 11:37", delisted: ["eBay", "Whatnot"] },
  { id: "sale_879", item: "Patek Philippe Nautilus", platform: "Whatnot" as const, price: 42500, soldAt: "2026-07-28 20:14", delisted: ["StockX", "eBay", "POS"] },
];

export const MOCK_EXCEPTIONS = [
  { id: "itm_1038", item: "Chrome Hearts Ring", reason: "Suspected counterfeit", flaggedAt: "2026-07-21", flaggedBy: "M. Reyes" },
  { id: "itm_1029", item: "Air Force 1 '07", reason: "Barcode mismatch", flaggedAt: "2026-07-19", flaggedBy: "System" },
  { id: "itm_1015", item: "Gucci Marmont Bag", reason: "Item damage — strap tear", flaggedAt: "2026-07-14", flaggedBy: "J. Cruz" },
];

export const MOCK_USERS = [
  { id: "usr_1", name: "Annie Santos", email: "annie@example.com", role: "Consignor", joined: "2026-03-11" },
  { id: "usr_2", name: "Marco Reyes", email: "marco@copyt.io", role: "Ops Staff", joined: "2026-01-05" },
  { id: "usr_3", name: "Jill Cruz", email: "jill@copyt.io", role: "Ops Staff", joined: "2026-01-05" },
  { id: "usr_4", name: "Devon Lee", email: "devon@example.com", role: "Consignor", joined: "2026-05-22" },
  { id: "usr_5", name: "Priya Shah", email: "priya@copyt.io", role: "Admin", joined: "2025-11-30" },
];

export const MOCK_INTEGRATIONS = [
  { platform: "StockX", status: "healthy" as const, rateLimit: "412 / 1000 req/hr" },
  { platform: "eBay", status: "healthy" as const, rateLimit: "1,204 / 5000 req/hr" },
  { platform: "Whatnot", status: "degraded" as const, rateLimit: "890 / 900 req/hr" },
  { platform: "Supabase Queues (pgmq)", status: "healthy" as const, rateLimit: "4 queues active" },
  { platform: "pg_cron", status: "healthy" as const, rateLimit: "4 scheduled jobs" },
];

export const PLATFORM_LABELS: Record<Platform, string> = {
  stockx: "StockX",
  ebay: "eBay",
  whatnot: "Whatnot",
  pos: "POS",
};
