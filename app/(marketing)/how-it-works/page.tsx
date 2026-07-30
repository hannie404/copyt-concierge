import { Section } from "@/components/Section";
import { StatusPill } from "@/components/StatusPill";
import { Card } from "@/components/Card";
import { ITEM_STATUS_ORDER } from "@/lib/pipeline";

const STEP_COPY: Record<string, string> = {
  received: "Your item arrives at our facility and is logged against your shipping label — you get a confirmation instantly.",
  authenticating: "Our authentication team reviews the item against manufacturer markers, materials, and known counterfeit signals.",
  photographed: "Studio-quality photos are captured and auto-enhanced for every listing platform's spec.",
  listed: "Listing copy and pricing are generated from recent comps and published to StockX, eBay, and Whatnot simultaneously.",
  sold: "The moment it sells on any platform, we delist everywhere else in real time — no double-sold risk.",
  paid: "Your payout is calculated and sent via Stripe Connect on the next scheduled payout run.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <Section tone="dark" className="text-center">
        <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl">
          From your closet to sold, in six steps.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-white/70">
          Every item that comes through Concierge follows the same tracked pipeline —
          here&apos;s exactly what happens at each stage.
        </p>
      </Section>

      <Section tone="light">
        <div className="grid gap-6 md:grid-cols-2">
          {ITEM_STATUS_ORDER.map((status, i) => (
            <Card key={status} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-extrabold text-brand-gray">
                  Step 0{i + 1}
                </span>
                <StatusPill status={status} />
              </div>
              <p className="text-sm text-brand-gray">{STEP_COPY[status]}</p>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
