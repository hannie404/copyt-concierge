import Link from "next/link";
import { Button } from "@/components/Button";

export default function SignupPage() {
  return (
    <main className="grid min-h-[calc(100vh-73px)] md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-brand-dark px-12 py-16 text-white md:flex">
        <p className="font-display text-lg font-extrabold">
          copyt <span className="text-brand-magenta">concierge</span>
        </p>
        <div>
          <h1 className="font-display text-3xl font-extrabold leading-tight">
            Ship it in. We sell it everywhere.
          </h1>
          <p className="mt-3 max-w-xs text-white/60">
            Join 2,000+ resellers who let Concierge handle authentication, listing,
            and payouts.
          </p>
        </div>
        <p className="text-xs text-white/40">© 2026 Copyt Concierge</p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <form className="w-full max-w-sm">
          <h2 className="font-display text-2xl font-extrabold text-brand-black">Get started</h2>
          <p className="mt-1 text-sm text-brand-gray">Create your account — it&apos;s free.</p>

          <label className="mt-8 block text-xs font-bold uppercase tracking-wide text-brand-gray">
            Full name
            <input
              type="text"
              placeholder="Annie Santos"
              className="mt-2 block w-full rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
            />
          </label>

          <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-brand-gray">
            Email
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-2 block w-full rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
            />
          </label>

          <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-brand-gray">
            Password
            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 block w-full rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
            />
          </label>

          <Button type="submit" variant="primary" className="mt-8 w-full justify-center">
            Create account
          </Button>

          <p className="mt-6 text-center text-sm text-brand-gray">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-brand-magenta">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
