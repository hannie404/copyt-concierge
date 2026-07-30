"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";

const OPS_NAV = [
  { href: "/ops/intake", label: "Intake" },
  { href: "/ops/authentication", label: "Authentication" },
  { href: "/ops/photography", label: "Photography" },
  { href: "/ops/listing", label: "Listing" },
  { href: "/ops/sold", label: "Sold" },
  { href: "/ops/exceptions", label: "Exceptions" },
  { href: "/ops/payouts", label: "Payouts" },
];

const ADMIN_NAV = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/pricing-config", label: "Pricing config" },
  { href: "/admin/integrations", label: "Integrations" },
  { href: "/admin/analytics", label: "Analytics" },
];

function NavGroup({
  heading,
  items,
  pathname,
  onNavigate,
}: {
  heading: string;
  items: typeof OPS_NAV;
  pathname: string | null;
  onNavigate?: () => void;
}) {
  return (
    <div>
      <p className="px-2 text-xs font-bold uppercase tracking-wide text-white/40">{heading}</p>
      <nav className="mt-2 flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                active ? "bg-brand-magenta text-white" : "text-white/80 hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function NavContent({ pathname, onNavigate }: { pathname: string | null; onNavigate?: () => void }) {
  return (
    <div className="mt-8 flex flex-col gap-6">
      <NavGroup heading="Operations" items={OPS_NAV} pathname={pathname} onNavigate={onNavigate} />
      <NavGroup heading="Admin" items={ADMIN_NAV} pathname={pathname} onNavigate={onNavigate} />
    </div>
  );
}

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-magenta text-xs font-bold text-white" aria-hidden="true">
      {initials || "?"}
    </div>
  );
}

export function OpsShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-white md:flex-row">
      {/* Mobile top bar - the only nav entry point below md, since the
          sidebar is desktop-only. Fixed so it stays visible while scrolling;
          the spacer div right after keeps content from sliding under it. */}
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-brand-dark px-4 py-3 md:hidden">
        <Link href="/" className="font-display text-base font-extrabold text-white">
          copyt <span className="text-brand-magenta">concierge</span>
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10"
        >
          {menuOpen ? (
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
      <div className="h-[57px] md:hidden" aria-hidden="true" />

      {menuOpen && (
        <div className="fixed inset-x-0 top-[57px] bottom-0 z-40 overflow-y-auto bg-brand-dark px-4 pb-6 md:hidden">
          <NavContent pathname={pathname} onNavigate={() => setMenuOpen(false)} />
        </div>
      )}

      <aside className="hidden w-64 shrink-0 bg-brand-dark px-4 py-6 md:block">
        <Link href="/" className="block px-2 font-display text-base font-extrabold text-white">
          copyt <span className="text-brand-magenta">concierge</span>
        </Link>
        <p className="px-2 pt-1 text-xs text-white/40">Ops &amp; Admin</p>
        <NavContent pathname={pathname} />
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-brand-grayPill px-4 py-4 md:px-8">
          <p className="text-sm text-brand-gray">Staff console</p>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-brand-black sm:inline">{userName}</span>
            <Initials name={userName} />
            <form action={signOut}>
              <button className="text-sm font-medium text-brand-gray hover:text-brand-magenta">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
