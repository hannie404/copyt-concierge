import Link from "next/link";
import { Button } from "@/components/Button";
import { PillNavItem } from "@/components/PillNavItem";

const LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/trust-authentication", label: "Trust" },
  { href: "/faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="w-full border-b border-brand-grayPill bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-extrabold text-brand-black">
          copyt <span className="text-brand-magenta">concierge</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <PillNavItem>{link.label}</PillNavItem>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-brand-black hover:text-brand-magenta">
            Sign in
          </Link>
          <Link href="/signup">
            <Button variant="primary" uppercase arrow>
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
