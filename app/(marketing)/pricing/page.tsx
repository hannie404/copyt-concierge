import Link from "next/link";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const TIERS = [
  {
    name: "Starter",
    volume: "1–10 items / month",
    flatFee: "$0",
    commission: "20%",
    highlight: false,
  },
  {
    name: "Reseller",
    volume: "11–50 items / month",
    flatFee: "$0",
    commission: "15%",
    highlight: true,
  },
  {
    name: "Power Seller",
    volume: "50+ items / month",
    flatFee: "$0",
    commission: "10%",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <main>
      <Section tone="dark" className="text-center">
        <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl">
          Simple, volume-based pricing.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-white/70">
          No upfront fees, ever. We only make money when you do — commission scales
          down as your volume goes up.
        </p>
      </Section>

      <Section tone="light">
        <div className="grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <Card
              key={tier.name}
              tone={tier.highlight ? "dark" : "light"}
              className={tier.highlight ? "ring-2 ring-brand-magenta" : ""}
            >
              <p className="font-display text-lg font-bold">{tier.name}</p>
              <p className={`mt-1 text-sm ${tier.highlight ? "text-white/60" : "text-brand-gray"}`}>
                {tier.volume}
              </p>
              <p className="mt-6 font-display text-4xl font-extrabold">{tier.commission}</p>
              <p className={`text-sm ${tier.highlight ? "text-white/60" : "text-brand-gray"}`}>
                commission per sale
              </p>
              <p className={`mt-4 text-xs ${tier.highlight ? "text-white/50" : "text-brand-gray"}`}>
                {tier.flatFee} flat listing fee
              </p>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-brand-gray">
          Commission covers authentication, photography, listing, and payout processing
          across all platforms — no hidden fees.
        </p>
      </Section>

      <Section tone="dark" className="text-center">
        <h2 className="font-display text-3xl font-extrabold text-white">
          Not sure which tier fits?
        </h2>
        <Link href="/signup" className="mt-6 inline-block">
          <Button variant="primary" uppercase arrow>
            Start free
          </Button>
        </Link>
      </Section>
    </main>
  );
}
