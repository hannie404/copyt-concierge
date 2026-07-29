import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function NewIntakePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">New intake</h1>
      <p className="mt-1 text-sm text-brand-gray">
        Request a shipping label or schedule a pickup, then declare the items you&apos;re sending in.
      </p>

      <Card className="mt-8 max-w-2xl">
        <p className="font-display text-lg font-bold text-brand-black">Shipping</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-xs font-bold uppercase tracking-wide text-brand-gray">
            Method
            <select className="mt-2 block w-full rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta">
              <option>Prepaid shipping label</option>
              <option>Schedule a pickup</option>
            </select>
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-brand-gray">
            Pickup date
            <input
              type="date"
              className="mt-2 block w-full rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
            />
          </label>
        </div>
      </Card>

      <Card className="mt-6 max-w-2xl">
        <p className="font-display text-lg font-bold text-brand-black">Items</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-xs font-bold uppercase tracking-wide text-brand-gray">
            Item description
            <input
              type="text"
              placeholder="e.g. Nike Air Jordan 4 'Retro'"
              className="mt-2 block w-full rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-brand-gray">
            Estimated value
            <input
              type="number"
              placeholder="$0.00"
              className="mt-2 block w-full rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
            />
          </label>
        </div>
        <button
          type="button"
          className="mt-4 text-sm font-medium text-brand-magenta hover:underline"
        >
          + Add another item
        </button>
      </Card>

      <Button variant="primary" className="mt-8" arrow>
        Submit intake request
      </Button>
    </div>
  );
}
