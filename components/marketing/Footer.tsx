import Link from "next/link";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/pricing", label: "Pricing" },
      { href: "/trust-authentication", label: "Trust & authentication" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Get started" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-brand-dark px-6 py-16 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-lg font-extrabold">
            copyt <span className="text-brand-magenta">concierge</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-white/60">
            Ship it. We sell it. Managed resale across StockX, eBay, and Whatnot.
          </p>
        </div>

        <div className="flex gap-16">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-bold uppercase tracking-wide text-white/50">{col.heading}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/80 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/40">
        © 2026 Copyt Concierge. All rights reserved.
      </div>
    </footer>
  );
}
