import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { MOCK_ITEMS } from "@/lib/mock-data";

export default function OpsAuthenticationPage() {
  const queue = MOCK_ITEMS.filter((item) => item.status === "authenticating" || item.status === "received");

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Authentication queue</h1>
      <p className="mt-1 text-sm text-brand-gray">{queue.length} items awaiting review.</p>

      <Card className="mt-6">
        <div className="divide-y divide-brand-grayPill">
          {queue.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-4 text-sm">
              <div>
                <p className="font-medium text-brand-black">{item.name}</p>
                <p className="text-xs text-brand-gray">{item.sku} · intake {item.intakeAt}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-full border-2 border-status-flagged px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-status-flagged">
                  Flag
                </button>
                <Button variant="primary" className="px-5 py-1.5 text-xs">
                  Approve
                </Button>
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
