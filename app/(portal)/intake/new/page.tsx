import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { createIntake } from "@/lib/actions/items";

export default async function NewIntakePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">New intake</h1>
      <p className="mt-1 text-sm text-brand-gray">
        Request a shipping label or schedule a pickup, then declare the item you&apos;re sending in.
      </p>

      {error && (
        <p className="mt-4 max-w-2xl rounded-card bg-status-flagged/10 px-4 py-3 text-sm text-status-flagged">
          {error}
        </p>
      )}

      <form action={createIntake}>
        <Card className="mt-6 max-w-2xl">
          <p className="font-display text-lg font-bold text-brand-black">Shipping</p>
          <p className="mt-1 text-xs text-brand-gray">
            Coming in a later phase — for now, ship items to our facility using your own method.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 opacity-50">
            <label className="block text-xs font-bold uppercase tracking-wide text-brand-gray">
              Method
              <select
                disabled
                className="mt-2 block w-full rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none"
              >
                <option>Prepaid shipping label</option>
                <option>Schedule a pickup</option>
              </select>
            </label>
            <label className="block text-xs font-bold uppercase tracking-wide text-brand-gray">
              Pickup date
              <input
                type="date"
                disabled
                className="mt-2 block w-full rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none"
              />
            </label>
          </div>
        </Card>

        <Card className="mt-6 max-w-2xl">
          <p className="font-display text-lg font-bold text-brand-black">Item</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-xs font-bold uppercase tracking-wide text-brand-gray">
              Item description
              <input
                name="description"
                type="text"
                required
                placeholder="e.g. Nike Air Jordan 4 'Retro'"
                className="mt-2 block w-full rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wide text-brand-gray">
              Estimated value
              <input
                name="estimatedValue"
                type="number"
                step="0.01"
                min="0"
                placeholder="$0.00"
                className="mt-2 block w-full rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
              />
            </label>
          </div>
        </Card>

        <Button type="submit" variant="primary" className="mt-8" arrow>
          Submit intake request
        </Button>
      </form>
    </div>
  );
}
