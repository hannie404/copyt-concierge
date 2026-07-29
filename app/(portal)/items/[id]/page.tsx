import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { StatusPill } from "@/components/StatusPill";
import { MOCK_ITEMS, ITEM_STATUS_ORDER, PLATFORM_LABELS } from "@/lib/mock-data";

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = MOCK_ITEMS.find((i) => i.id === id);
  if (!item) notFound();

  const currentIndex = ITEM_STATUS_ORDER.indexOf(item.status);
  const flagged = item.status === "flagged";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-black">{item.name}</h1>
          <p className="mt-1 text-sm text-brand-gray">{item.sku}</p>
        </div>
        <StatusPill status={item.status} />
      </div>

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
              <dd className="text-brand-black">{item.intakeAt}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-gray">Estimated value</dt>
              <dd className="text-brand-black">${item.price.toLocaleString()}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <p className="font-display text-lg font-bold text-brand-black">Live listings</p>
          {item.platforms.length === 0 ? (
            <p className="mt-4 text-sm text-brand-gray">Not listed yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {item.platforms.map((platform) => (
                <li key={platform} className="flex items-center justify-between text-sm">
                  <span className="text-brand-black">{PLATFORM_LABELS[platform]}</span>
                  <span className="text-status-listed">Live</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
