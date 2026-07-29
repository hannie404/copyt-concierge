import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { MOCK_ITEMS } from "@/lib/mock-data";

export default function OpsIntakePage() {
  const recent = MOCK_ITEMS.slice(0, 6);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Intake station</h1>
      <p className="mt-1 text-sm text-brand-gray">Scan or enter a barcode to log a new item.</p>

      <Card className="mt-6 max-w-xl">
        <label className="block text-xs font-bold uppercase tracking-wide text-brand-gray">
          Barcode / SKU
          <div className="mt-2 flex gap-3">
            <input
              autoFocus
              placeholder="Scan or type barcode"
              className="flex-1 rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
            />
            <Button variant="primary">Log item</Button>
          </div>
        </label>
      </Card>

      <Card className="mt-6">
        <p className="font-display text-lg font-bold text-brand-black">Recently logged</p>
        <div className="mt-4 divide-y divide-brand-grayPill">
          {recent.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 text-sm">
              <span className="text-brand-black">{item.name}</span>
              <span className="text-brand-gray">{item.sku}</span>
              <span className="text-brand-gray">{item.intakeAt}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
