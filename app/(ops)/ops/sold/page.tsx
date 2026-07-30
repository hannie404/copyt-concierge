import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Pagination, PAGE_SIZE } from "@/components/Pagination";
import { PLATFORM_LABELS } from "@/lib/pipeline";
import { getAdapterMode } from "@/lib/platform-adapter";
import { simulateSale } from "@/lib/actions/simulate-sale";
import { createClient } from "@/lib/supabase/server";
import type { Platform } from "@/lib/queue-names";

async function getRecentSales(page: number) {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: sales, count } = await supabase
    .from("sales")
    .select("id, item_id, platform, sale_price, sold_at, items(description)", { count: "exact" })
    .order("sold_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  if (!sales?.length) return { sales: [], totalPages };

  const { data: delistedListings } = await supabase
    .from("listings")
    .select("item_id, platform")
    .eq("status", "delisted")
    .in(
      "item_id",
      sales.map((s) => s.item_id)
    );

  return {
    sales: sales.map((sale) => ({
      id: sale.id,
      item: (sale.items as unknown as { description: string } | null)?.description ?? "Unknown item",
      platform: sale.platform as Platform,
      price: Number(sale.sale_price),
      soldAt: new Date(sale.sold_at).toLocaleString(),
      delisted: (delistedListings ?? [])
        .filter((l) => l.item_id === sale.item_id)
        .map((l) => PLATFORM_LABELS[l.platform as Platform]),
    })),
    totalPages,
  };
}

async function getSimulatableListings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("id, platform, item_id, items(description)")
    .eq("status", "active");

  return (data ?? [])
    .filter((listing) => getAdapterMode(listing.platform as Platform) === "mock")
    .map((listing) => ({
      id: listing.id,
      platform: listing.platform as Platform,
      itemId: listing.item_id,
      description: (listing.items as unknown as { description: string } | null)?.description ?? "Unknown item",
    }));
}

export default async function OpsSoldPage({
  searchParams,
}: {
  searchParams: Promise<{ simulated?: string; error?: string; page?: string }>;
}) {
  const { simulated, error, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const simulatable = await getSimulatableListings();
  const { sales, totalPages } = await getRecentSales(currentPage);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Sold feed</h1>
      <p className="mt-1 text-sm text-brand-gray">Live sales and delist-everywhere confirmation status.</p>

      {simulated && (
        <p className="mt-4 rounded-card bg-status-sold/10 px-4 py-3 text-sm text-status-sold">
          Simulated sale sent — the delisting chain is running.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-card bg-status-flagged/10 px-4 py-3 text-sm text-status-flagged">
          {error}
        </p>
      )}

      <Card className="mt-6">
        <p className="font-display text-lg font-bold text-brand-black">Simulate a sale (demo)</p>
        <p className="mt-1 text-xs text-brand-gray">
          No real marketplace credentials are configured — trigger the real webhook →
          delist-everywhere chain against a mock platform instead of waiting for a real sale.
        </p>
        {simulatable.length === 0 ? (
          <p className="mt-4 text-sm text-brand-gray">No active mock-platform listings to simulate against.</p>
        ) : (
          <div className="mt-4 divide-y divide-brand-grayPill">
            {simulatable.map((listing) => (
              <div key={listing.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <span className="text-brand-black">{listing.description}</span>
                  <span className="ml-2 text-xs text-brand-gray">{PLATFORM_LABELS[listing.platform]}</span>
                </div>
                <form action={simulateSale}>
                  <input type="hidden" name="itemId" value={listing.itemId} />
                  <input type="hidden" name="platform" value={listing.platform} />
                  <input type="hidden" name="redirectTo" value="/ops/sold" />
                  <Button type="submit" variant="outline" className="px-4 py-1.5 text-xs">
                    Simulate sale
                  </Button>
                </form>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="mt-6 space-y-4">
        {sales.map((sale) => (
          <Card key={sale.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-brand-black">{sale.item}</p>
                <p className="text-xs text-brand-gray">
                  Sold on <span className="text-status-listed">{PLATFORM_LABELS[sale.platform]}</span> · {sale.soldAt}
                </p>
              </div>
              <p className="font-display text-lg font-extrabold text-brand-black">
                ${sale.price.toLocaleString()}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {sale.delisted.map((platform) => (
                <span
                  key={platform}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-grayPill px-3 py-1 text-xs font-medium text-brand-black"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-status-sold" />
                  Delisted from {platform}
                </span>
              ))}
            </div>
          </Card>
        ))}
        {sales.length === 0 && (
          <p className="py-6 text-center text-sm text-brand-gray">No sales yet.</p>
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/ops/sold" />
    </div>
  );
}
