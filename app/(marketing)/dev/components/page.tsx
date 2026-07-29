import { Button } from "@/components/Button";
import { PillNavItem } from "@/components/PillNavItem";
import { Card } from "@/components/Card";
import { StatBlock } from "@/components/StatBlock";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { StatusPill } from "@/components/StatusPill";
import type { ItemStatus } from "@/lib/queue-names";

const ALL_STATUSES: ItemStatus[] = [
  "received",
  "authenticating",
  "flagged",
  "photographed",
  "listed",
  "sold",
  "paid",
];

// Temporary gallery page for Phase 1 design-system QA — remove once Phase 2+
// real pages exist. Not part of the SPEC.md route inventory.
export default function ComponentGalleryPage() {
  return (
    <main>
      <Section tone="light">
        <h1 className="font-display text-4xl font-extrabold">Component gallery</h1>
        <p className="mt-2 text-brand-gray">
          Phase 1 design system — every component/variant in both light and dark contexts.
        </p>

        <h2 className="mt-12 font-display text-2xl font-extrabold">Buttons</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Button variant="primary">Start free</Button>
          <Button variant="primary" arrow uppercase>
            Start free
          </Button>
          <Button variant="outline">See how it works</Button>
        </div>

        <h2 className="mt-12 font-display text-2xl font-extrabold">Pill nav items</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <PillNavItem>Services</PillNavItem>
          <PillNavItem>Learning</PillNavItem>
          <PillNavItem active>Support</PillNavItem>
        </div>

        <h2 className="mt-12 font-display text-2xl font-extrabold">Stat blocks</h2>
        <div className="mt-4 flex flex-wrap divide-x divide-brand-grayPill">
          <div className="pr-10">
            <StatBlock value="2K+" label="Active Resellers" />
          </div>
          <div className="px-10">
            <StatBlock value="<5s" label="To Log Items" />
          </div>
          <div className="px-10">
            <StatBlock value="6" label="Platform Integrations" />
          </div>
          <div className="pl-10">
            <StatBlock value="$75M+" label="Earned by Users" />
          </div>
        </div>

        <h2 className="mt-12 font-display text-2xl font-extrabold">Cards</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <Card className="w-64">
            <p className="font-semibold">Light card</p>
            <p className="mt-1 text-sm text-brand-gray">16px radius, content container only.</p>
          </Card>
          <Card tone="dark" className="w-64">
            <p className="font-semibold">Dark card</p>
            <p className="mt-1 text-sm text-white/70">Same shape, dark tone.</p>
          </Card>
        </div>

        <h2 className="mt-12 font-display text-2xl font-extrabold">Status pills</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {ALL_STATUSES.map((status) => (
            <StatusPill key={status} status={status} />
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <h2 className="font-display text-2xl font-extrabold text-white">Dark section context</h2>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button variant="primary">Start free today</Button>
          <Button variant="outline" tone="dark">
            See how it works
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap divide-x divide-white/15">
          <div className="pr-10">
            <StatBlock value="2K+" tone="dark" label="Active Resellers" />
          </div>
          <div className="px-10">
            <StatBlock value="<5s" tone="dark" label="To Log Items" />
          </div>
          <div className="px-10">
            <StatBlock value="6" tone="dark" label="Platform Integrations" />
          </div>
          <div className="pl-10">
            <StatBlock value="$75M+" tone="dark" label="Earned by Users" />
          </div>
        </div>

        <h3 className="mt-12 font-display text-xl font-extrabold text-white">
          Glass card (floating over dark)
        </h3>
        <div className="relative mt-4 flex h-64 items-center justify-center rounded-card bg-black/30">
          <div className="absolute left-8 top-8">
            <GlassCard value="6,216" label="Items Managed" />
          </div>
          <div className="absolute bottom-8 right-8">
            <GlassCard value="$94,529" label="Total Profit" />
          </div>
        </div>
      </Section>
    </main>
  );
}
