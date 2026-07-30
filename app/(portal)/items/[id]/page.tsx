import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { StatusPill } from "@/components/StatusPill";
import { getItemById } from "@/lib/data/items";
import { ITEM_STATUS_ORDER, PLATFORM_LABELS } from "@/lib/pipeline";
import { getAdapterMode } from "@/lib/platform-adapter";
import { simulateSale } from "@/lib/actions/simulate-sale";
import type { Platform } from "@/lib/queue-names";

export default async function ItemDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ simulated?: string; error?: string }>;
}) {
  const { id } = await params;
  const { simulated, error } = await searchParams;
  const item = await getItemById(id);
  if (!item) notFound();

  const currentIndex = ITEM_STATUS_ORDER.indexOf(item.status);
  const flagged = item.status === "flagged";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-black">{item.description}</h1>
          <p className="mt-1 text-sm text-brand-gray">{item.sku}</p>
        </div>
        <StatusPill status={item.status} />
      </div>

      {simulated && (
        <p className="mt-4 rounded-card bg-status-sold/10 px-4 py-3 text-sm text-status-sold">
          Simulated sale sent — the delisting chain is running, reload in a moment to see the result.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-card bg-status-flagged/10 px-4 py-3 text-sm text-status-flagged">
          {error}
        </p>
      )}

      <Card className="mt-8">
        <p className="font-display text-lg font-bold text-brand-black">Status tracker</p>
        {flagged ? (
          <p className="mt-4 text-sm text-status-flagged">
            This item has been flagged during authentication and routed to our exceptions
            team — see /ops/exceptions for internal review status.
          </p>
        ) : (
          <div className="mt-6 flex items-center gap-1 overflow-x-auto pb-2">
            {ITEM_STATUS_ORDER.map((status, i) => (
              <div key={status} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      i <= currentIndex ? "bg-brand-magenta" : "bg-brand-grayPill"
                    }`}
                  />
                  <span
                    className={`text-xs font-bold uppercase tracking-wide ${
                      i <= currentIndex ? "text-brand-black" : "text-brand-gray"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                {i < ITEM_STATUS_ORDER.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 w-10 md:w-16 ${
                      i < currentIndex ? "bg-brand-magenta" : "bg-brand-grayPill"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <p className="font-display text-lg font-bold text-brand-black">Details</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-gray">Intake date</dt>
              <dd className="text-brand-black">{item.intakeAt.slice(0, 10)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-gray">Estimated value</dt>
              <dd className="text-brand-black">
                {item.estimatedValue != null ? `$${item.estimatedValue.toLocaleString()}` : "—"}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <p className="font-display text-lg font-bold text-brand-black">Live listings</p>
          {item.listings.length === 0 ? (
            <p className="mt-4 text-sm text-brand-gray">Not listed yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {item.listings.map((listing) => {
                const platform = listing.platform as Platform;
                const isMock = getAdapterMode(platform) === "mock";
                return (
                  <li key={listing.platform} className="flex items-center justify-between text-sm">
                    <span className="text-brand-black">{PLATFORM_LABELS[platform]}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-status-listed">Live</span>
                      {isMock && (
                        <form action={simulateSale}>
                          <input type="hidden" name="itemId" value={item.id} />
                          <input type="hidden" name="platform" value={platform} />
                          <input type="hidden" name="redirectTo" value={`/items/${item.id}`} />
                          <Button type="submit" variant="outline" className="px-4 py-1.5 text-xs">
                            Simulate sale
                          </Button>
                        </form>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
