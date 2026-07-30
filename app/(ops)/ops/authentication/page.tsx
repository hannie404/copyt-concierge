import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { approveItem, flagItem } from "@/lib/actions/authentication";
import { createClient } from "@/lib/supabase/server";

async function getAuthenticationQueue() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("items")
    .select("id, sku, description, status, intake_at")
    .in("status", ["received", "authenticating"])
    .order("intake_at", { ascending: true });

  if (!items?.length) return [];

  const { data: scores } = await supabase
    .from("auth_scores")
    .select("item_id, score, created_at")
    .in(
      "item_id",
      items.map((item) => item.id)
    )
    .order("created_at", { ascending: false });

  const latestScoreByItem = new Map<string, number>();
  for (const s of scores ?? []) {
    if (!latestScoreByItem.has(s.item_id)) latestScoreByItem.set(s.item_id, s.score);
  }

  return items.map((item) => ({
    ...item,
    score: latestScoreByItem.get(item.id) ?? null,
  }));
}

export default async function OpsAuthenticationPage({
  searchParams,
}: {
  searchParams: Promise<{ reviewed?: string; error?: string }>;
}) {
  const { reviewed, error } = await searchParams;
  const queue = await getAuthenticationQueue();

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Authentication queue</h1>
      <p className="mt-1 text-sm text-brand-gray">{queue.length} items awaiting review.</p>

      {reviewed && (
        <p className="mt-4 rounded-card bg-status-sold/10 px-4 py-3 text-sm text-status-sold">
          Review recorded.
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
            <div key={item.id} className="flex items-center justify-between py-4 text-sm">
              <div>
                <p className="font-medium text-brand-black">{item.description}</p>
                <p className="text-xs text-brand-gray">
                  {item.sku} · intake {new Date(item.intake_at).toLocaleDateString()}
                  {item.score !== null && (
                    <>
                      {" "}
                      · <span className="text-brand-black">Auth score {item.score}/100</span>{" "}
                      <span className="text-[10px] uppercase text-brand-gray">(stub)</span>
                    </>
                  )}
                  {item.status === "received" && item.score === null && (
                    <> · scoring in progress</>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <form action={flagItem}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <button
                    type="submit"
                    className="rounded-full border-2 border-status-flagged px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-status-flagged"
                  >
                    Flag
                  </button>
                </form>
                <form action={approveItem}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <Button type="submit" variant="primary" className="px-5 py-1.5 text-xs">
                    Approve
                  </Button>
                </form>
              </div>
            </div>
          ))}
          {queue.length === 0 && (
            <p className="py-6 text-center text-sm text-brand-gray">Queue is empty.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
