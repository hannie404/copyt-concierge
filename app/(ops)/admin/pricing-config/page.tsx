import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const TIERS = [
  { name: "Starter", minVolume: 1, maxVolume: 10, commission: 20 },
  { name: "Reseller", minVolume: 11, maxVolume: 50, commission: 15 },
  { name: "Power Seller", minVolume: 51, maxVolume: null, commission: 10 },
];

export default function AdminPricingConfigPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Pricing config</h1>
      <p className="mt-1 text-sm text-brand-gray">Commission tiers by monthly item volume.</p>

      <div className="mt-6 space-y-4">
        {TIERS.map((tier) => (
          <Card key={tier.name}>
            <div className="grid gap-4 md:grid-cols-4 md:items-end">
              <label className="text-xs font-bold uppercase tracking-wide text-brand-gray">
                Tier name
                <input
                  defaultValue={tier.name}
                  className="mt-2 block w-full rounded-full border border-brand-grayPill px-4 py-2 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-brand-gray">
                Min volume
                <input
                  defaultValue={tier.minVolume}
                  type="number"
                  className="mt-2 block w-full rounded-full border border-brand-grayPill px-4 py-2 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-brand-gray">
                Max volume
                <input
                  defaultValue={tier.maxVolume ?? ""}
                  placeholder="No limit"
                  type="number"
                  className="mt-2 block w-full rounded-full border border-brand-grayPill px-4 py-2 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-brand-gray">
                Commission %
                <input
                  defaultValue={tier.commission}
                  type="number"
                  className="mt-2 block w-full rounded-full border border-brand-grayPill px-4 py-2 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
                />
              </label>
            </div>
          </Card>
        ))}
      </div>

      <Button variant="primary" className="mt-6">
        Save changes
      </Button>
    </div>
  );
}
