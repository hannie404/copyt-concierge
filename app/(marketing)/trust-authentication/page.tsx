import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

const CHECKS = [
  { label: "Manufacturer markers", body: "Stitching, materials, hardware, and serials verified against known-authentic references." },
  { label: "Expert review", body: "Every item passes a trained human authenticator before it moves to photography." },
  { label: "Counterfeit database", body: "Cross-checked against a continuously updated database of known counterfeit patterns." },
  { label: "Flag & escalate", body: "Anything uncertain is routed to our exceptions queue for a second review, not shipped or listed." },
];

export default function TrustAuthenticationPage() {
  return (
    <main>
      <Section tone="dark">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl">
            Nothing gets listed until it&apos;s verified.
          </h1>
          <p className="mt-4 text-white/70">
            Every single item that comes through Concierge — sneakers, watches, bags,
            streetwear — passes through the same authentication process before it ever
            reaches a marketplace. That&apos;s the trust buyers are paying for.
          </p>
        </div>
      </Section>

      <Section tone="light">
        <div className="grid gap-6 md:grid-cols-2">
          {CHECKS.map((check) => (
            <Card key={check.label}>
              <p className="font-display text-lg font-bold text-brand-black">{check.label}</p>
              <p className="mt-2 text-sm text-brand-gray">{check.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="dark" className="text-center">
        <h2 className="font-display text-2xl font-extrabold text-white md:text-3xl">
          If it doesn&apos;t clear authentication, it doesn&apos;t get sold — full stop.
        </h2>
      </Section>
    </main>
  );
}
