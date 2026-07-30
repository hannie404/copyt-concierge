import Link from "next/link";
import { Button } from "@/components/Button";
import { PillNavItem } from "@/components/PillNavItem";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";

const LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/trust-authentication", label: "Trust" },
  { href: "/faq", label: "FAQ" },
];

export async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isStaff = false;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    isStaff = profile?.role === "staff" || profile?.role === "admin";
  }

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

        {user ? (
          <div className="flex items-center gap-4">
            <Link
              href={isStaff ? "/ops/intake" : "/dashboard"}
              className="text-sm font-medium text-brand-black hover:text-brand-magenta"
            >
              {isStaff ? "Staff console" : "Dashboard"}
            </Link>
            <form action={signOut}>
              <button className="text-sm font-medium text-brand-gray hover:text-brand-magenta">
                Sign out
              </button>
            </form>
          </div>
        ) : (
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
        )}
      </div>
    </header>
  );
}
