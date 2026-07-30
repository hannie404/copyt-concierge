"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

type LinkItem = { href: string; label: string };

// The nav's primary links (How it works/Pricing/etc.) and the sign-in/get-
// started actions are hidden below md with no other entry point - this is
// the mobile fallback so they're still reachable without scrolling to the
// footer. `authSection` is server-rendered JSX (the same auth block used on
// desktop) passed through as a prop, so sign-out's server action keeps working.
// Renders as a fixed, full-viewport overlay (not an absolutely-positioned
// panel) so the page content behind it never bleeds through.
export function MobileNavToggle({ links, authSection }: { links: LinkItem[]; authSection: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative z-50 flex h-9 w-9 items-center justify-center rounded-full text-brand-black hover:bg-brand-grayPill"
      >
        {open ? (
          <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-[73px] bottom-0 z-40 overflow-y-auto bg-white">
          <nav className="flex flex-col gap-1 px-6 py-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-3 text-base font-medium text-brand-black hover:bg-brand-grayPill"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 border-t border-brand-grayPill px-6 py-6" onClick={() => setOpen(false)}>
            {authSection}
          </div>
        </div>
      )}
    </div>
  );
}
