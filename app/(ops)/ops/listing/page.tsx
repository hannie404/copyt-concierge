import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { MOCK_ITEMS } from "@/lib/mock-data";

export default function OpsListingPage() {
  const queue = MOCK_ITEMS.filter((item) => item.status === "photographed");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-black">Listing review</h1>
          <p className="mt-1 text-sm text-brand-gray">
            Review auto-generated copy and price before publishing across platforms.
          </p>
        </div>
        <Button variant="primary" arrow>
          Bulk publish
        </Button>
      </div>

      <Card className="mt-6">
        <div className="divide-y divide-brand-grayPill">
          {queue.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-4 text-sm">
              <div>
                <p className="font-medium text-brand-black">{item.name}</p>
                <p className="text-xs text-brand-gray">Auto-generated title & description ready</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-brand-gray">Suggested: ${item.price.toLocaleString()}</span>
                <Button variant="outline" className="px-5 py-1.5 text-xs">
                  Publish
                </Button>
              </div>
            </div>
          ))}
          {queue.length === 0 && (
            <p className="py-6 text-center text-sm text-brand-gray">Nothing pending review.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
