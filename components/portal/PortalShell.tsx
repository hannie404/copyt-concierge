"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/intake/new", label: "New intake" },
  { href: "/items", label: "Items" },
  { href: "/payouts", label: "Payouts" },
  { href: "/settings", label: "Settings" },
];

export function PortalShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="hidden w-60 shrink-0 bg-brand-dark px-4 py-6 md:block">
        <Link href="/" className="block px-2 font-display text-base font-extrabold text-white">
          copyt <span className="text-brand-magenta">concierge</span>
        </Link>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
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
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-brand-grayPill px-8 py-4">
          <p className="text-sm text-brand-gray">Consignor Portal</p>
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
