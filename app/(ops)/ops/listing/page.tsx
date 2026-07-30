import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/server";
import { publishListing } from "@/lib/actions/listing";
import { PLATFORM_LABELS } from "@/lib/pipeline";
import type { Platform } from "@/lib/queue-names";

const LISTABLE_PLATFORMS: Platform[] = ["stockx", "ebay", "whatnot"];

async function getListingQueue() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("items")
    .select("id, sku, description, estimated_value")
    .eq("status", "photographed")
    .order("intake_at", { ascending: true });
  return data ?? [];
}

export default async function OpsListingPage({
  searchParams,
}: {
  searchParams: Promise<{ published?: string; error?: string }>;
}) {
  const { published, error } = await searchParams;
  const queue = await getListingQueue();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-black">Listing review</h1>
          <p className="mt-1 text-sm text-brand-gray">
            Set a price and platforms, then publish across the marketplace(s).
          </p>
        </div>
      </div>

      {published && (
        <p className="mt-4 rounded-card bg-status-sold/10 px-4 py-3 text-sm text-status-sold">
          Listing published.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-card bg-status-flagged/10 px-4 py-3 text-sm text-status-flagged">
          {error}
        </p>
      )}

      <Card className="mt-6">
        <div className="divide-y divide-brand-grayPill">
          {queue.map((item) => (
            <form
              key={item.id}
              action={publishListing}
              className="flex flex-wrap items-center justify-between gap-4 py-4 text-sm"
            >
              <input type="hidden" name="itemId" value={item.id} />
              <div>
                <p className="font-medium text-brand-black">{item.description}</p>
                <p className="text-xs text-brand-gray">{item.sku}</p>
              </div>
              <div className="flex items-center gap-4">
                {LISTABLE_PLATFORMS.map((platform) => (
                  <label key={platform} className="flex items-center gap-1.5 text-xs text-brand-gray">
                    <input type="checkbox" name={`platform_${platform}`} className="h-4 w-4 accent-brand-magenta" />
                    {PLATFORM_LABELS[platform]}
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  required
                  defaultValue={item.estimated_value ?? undefined}
                  placeholder="Price"
                  className="w-28 rounded-full border border-brand-grayPill px-4 py-1.5 text-xs text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
                />
                <Button type="submit" variant="outline" className="px-5 py-1.5 text-xs">
                  Publish
                </Button>
              </div>
            </form>
          ))}
          {queue.length === 0 && (
            <p className="py-6 text-center text-sm text-brand-gray">Nothing pending review.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
