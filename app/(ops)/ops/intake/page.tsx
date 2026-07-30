import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/server";
import { lookupItem } from "@/lib/actions/intake";

async function getRecentItems() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("items")
    .select("id, sku, description, intake_at")
    .order("intake_at", { ascending: false })
    .limit(6);
  return data ?? [];
}

async function getFoundItem(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("items")
    .select("id, sku, description, status, intake_at")
    .eq("id", id)
    .single();
  return data;
}

export default async function OpsIntakePage({
  searchParams,
}: {
  searchParams: Promise<{ found?: string; notfound?: string }>;
}) {
  const { found, notfound } = await searchParams;
  const recent = await getRecentItems();
  const foundItem = found ? await getFoundItem(found) : null;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Intake station</h1>
      <p className="mt-1 text-sm text-brand-gray">
        Scan or enter a barcode to confirm a shipment matches a declared item.
      </p>

      <Card className="mt-6 max-w-xl">
        <form action={lookupItem}>
          <label className="block text-xs font-bold uppercase tracking-wide text-brand-gray">
            Barcode / SKU
            <div className="mt-2 flex gap-3">
              <input
                name="code"
                autoFocus
                required
                placeholder="Scan or type barcode"
                className="flex-1 rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
              />
              <Button type="submit" variant="primary">
                Log item
              </Button>
            </div>
          </label>
        </form>

        {foundItem && (
          <div className="mt-4 rounded-card bg-status-sold/10 px-4 py-3 text-sm text-status-sold">
            Found: {foundItem.description} ({foundItem.sku}) — status {foundItem.status}
          </div>
        )}
        {notfound && (
          <div className="mt-4 rounded-card bg-status-flagged/10 px-4 py-3 text-sm text-status-flagged">
            No item matches that barcode/SKU.
          </div>
        )}
      </Card>

      <Card className="mt-6">
        <p className="font-display text-lg font-bold text-brand-black">Recently logged</p>
        <div className="mt-4 divide-y divide-brand-grayPill">
          {recent.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 gap-1 py-3 text-sm sm:grid-cols-[2fr_1fr_auto] sm:items-center sm:gap-4"
            >
              <span className="truncate text-brand-black">{item.description}</span>
              <span className="text-xs text-brand-gray sm:text-sm">{item.sku}</span>
              <span className="text-xs text-brand-gray sm:text-right sm:text-sm">
                {new Date(item.intake_at).toLocaleDateString()}
              </span>
            </div>
          ))}
          {recent.length === 0 && (
            <p className="py-6 text-center text-sm text-brand-gray">No items logged yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
