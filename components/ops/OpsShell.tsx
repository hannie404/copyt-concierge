"use client";

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
}: {
  heading: string;
  items: typeof OPS_NAV;
  pathname: string | null;
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

export function OpsShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="hidden w-64 shrink-0 bg-brand-dark px-4 py-6 md:block">
        <Link href="/" className="block px-2 font-display text-base font-extrabold text-white">
          copyt <span className="text-brand-magenta">concierge</span>
        </Link>
        <p className="px-2 pt-1 text-xs text-white/40">Ops &amp; Admin</p>

        <div className="mt-8 flex flex-col gap-6">
          <NavGroup heading="Operations" items={OPS_NAV} pathname={pathname} />
          <NavGroup heading="Admin" items={ADMIN_NAV} pathname={pathname} />
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-brand-grayPill px-8 py-4">
          <p className="text-sm text-brand-gray">Staff console</p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-brand-black">{userName}</span>
            <div className="h-8 w-8 rounded-full bg-brand-grayPill" aria-hidden="true" />
            <form action={signOut}>
              <button className="text-sm font-medium text-brand-gray hover:text-brand-magenta">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
