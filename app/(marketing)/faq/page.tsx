import { Section } from "@/components/Section";

const FAQS = [
  {
    q: "How does Concierge decide what commission I pay?",
    a: "Commission is based on your monthly item volume — the more you ship, the lower your rate. See the Pricing page for exact tiers.",
  },
  {
    q: "What happens if my item fails authentication?",
    a: "It's flagged and routed to our exceptions team, who will reach out to you directly with next steps rather than shipping or listing it.",
  },
  {
    q: "How fast do I get paid after something sells?",
    a: "Payouts run on a weekly batch via Stripe Connect. You can track the exact date on your Payouts page.",
  },
  {
    q: "What if an item sells on two platforms at once?",
    a: "It can't — the moment a sale is confirmed on any platform, we delist it everywhere else instantly and automatically.",
  },
  {
    q: "Which platforms do you list on?",
    a: "StockX, eBay, and Whatnot today, with more integrations planned. You can see live integration health in your dashboard.",
  },
  {
    q: "Can I set a minimum price?",
    a: "Yes — you set price bounds during intake, and our dynamic repricing engine only adjusts within that range.",
  },
];

export default function FaqPage() {
  return (
    <main>
      <Section tone="light">
        <h1 className="font-display text-4xl font-extrabold text-brand-black md:text-5xl">
          Frequently asked questions
        </h1>

        <div className="mt-12 divide-y divide-brand-grayPill">
          {FAQS.map((item) => (
            <div key={item.q} className="py-6">
              <p className="font-display text-lg font-bold text-brand-black">{item.q}</p>
              <p className="mt-2 text-sm text-brand-gray">{item.a}</p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
