import Link from "next/link";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { StatBlock } from "@/components/StatBlock";
import { GlassCard } from "@/components/GlassCard";
import { Card } from "@/components/Card";
import { StatusPill } from "@/components/StatusPill";
import { MOCK_ITEMS } from "@/lib/mock-data";

const STATS = [
  { value: "2K+", label: "Active Resellers" },
  { value: "<5s", label: "To Log Items" },
  { value: "6", label: "Platform Integrations" },
  { value: "$75M+", label: "Earned by Users" },
];

const MOCKUP_ITEMS = MOCK_ITEMS.slice(0, 4);

const STEPS = [
  { title: "Ship it in", body: "Request a label, pack your items, drop them off. We handle intake and cataloging." },
  { title: "We authenticate & list", body: "Every item is authenticated, photographed, and cross-listed on StockX, eBay, and Whatnot." },
  { title: "You get paid", body: "The moment it sells, we delist everywhere and send your payout — no manual work." },
];

export default function LandingPage() {
  return (
    <main>
      <Section tone="dark" className="pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl font-extrabold leading-tight text-white md:text-6xl">
            Ship it in. We sell it{" "}
            <span className="bg-gradient-to-r from-brand-magenta to-brand-magentaLight bg-clip-text text-transparent">
              everywhere.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-white/70">
            The managed resale service that authenticates, photographs, lists, sells, and
            pays out — across StockX, eBay, and Whatnot, without you lifting a finger.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/signup">
              <Button variant="primary" uppercase arrow>
                Start free
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" tone="dark">
                See how it works
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap divide-x divide-white/15">
          {STATS.map((stat, i) => (
            <div key={stat.label} className={i === 0 ? "pr-10" : i === STATS.length - 1 ? "pl-10" : "px-10"}>
              <StatBlock value={stat.value} label={stat.label} tone="dark" />
            </div>
          ))}
        </div>
      </Section>

      <Section tone="light">
        <h2 className="max-w-xl font-display text-3xl font-extrabold text-brand-black md:text-4xl">
          Your entire resale business, handled.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Card key={step.title}>
              <span className="font-display text-sm font-extrabold text-brand-magenta">
                0{i + 1}
              </span>
              <p className="mt-3 font-display text-lg font-bold text-brand-black">{step.title}</p>
              <p className="mt-2 text-sm text-brand-gray">{step.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <div className="relative flex min-h-72 items-center justify-center rounded-card bg-black/30 p-6 md:min-h-96 md:p-10">
          <div className="absolute left-6 top-6 z-10 md:left-10 md:top-10">
            <GlassCard value="6,216" label="Items Managed" />
          </div>
          <div className="absolute bottom-6 right-6 z-10 md:bottom-10 md:right-10">
            <GlassCard value="$94,529" label="Total Profit" />
          </div>

          <div className="w-full max-w-md rounded-card bg-white p-5 shadow-card-float">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-gray">Pipeline</p>
            <div className="mt-3 divide-y divide-brand-grayPill">
              {MOCKUP_ITEMS.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-brand-black">{item.name}</p>
                    <p className="text-xs text-brand-gray">{item.sku}</p>
                  </div>
                  <StatusPill status={item.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="light" className="text-center">
        <h2 className="font-display text-3xl font-extrabold text-brand-black md:text-4xl">
          Every item, authenticated first.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-brand-gray">
          Buyers trust what we list because nothing goes live until it clears our
          authentication queue — see how the process works.
        </p>
        <Link href="/trust-authentication" className="mt-6 inline-block">
          <Button variant="outline">Learn about authentication</Button>
        </Link>
      </Section>

      <Section tone="dark" className="text-center">
        <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">
          Ready to stop listing it yourself?
        </h2>
        <Link href="/signup" className="mt-6 inline-block">
          <Button variant="primary" uppercase arrow>
            Get started
          </Button>
        </Link>
      </Section>
    </main>
  );
}
