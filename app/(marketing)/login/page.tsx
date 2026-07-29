import Link from "next/link";
import { Button } from "@/components/Button";

export default function LoginPage() {
  return (
    <main className="grid min-h-[calc(100vh-73px)] md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-brand-dark px-12 py-16 text-white md:flex">
        <p className="font-display text-lg font-extrabold">
          copyt <span className="text-brand-magenta">concierge</span>
        </p>
        <div>
          <h1 className="font-display text-3xl font-extrabold leading-tight">
            Welcome back.
          </h1>
          <p className="mt-3 max-w-xs text-white/60">
            Track your items, see live sales, and manage payouts across every platform
            in one place.
          </p>
        </div>
        <p className="text-xs text-white/40">© 2026 Copyt Concierge</p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <form className="w-full max-w-sm">
          <h2 className="font-display text-2xl font-extrabold text-brand-black">Sign in</h2>
          <p className="mt-1 text-sm text-brand-gray">Enter your details to access your dashboard.</p>

          <label className="mt-8 block text-xs font-bold uppercase tracking-wide text-brand-gray">
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
            Sign in
          </Button>

          <p className="mt-6 text-center text-sm text-brand-gray">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-brand-magenta">
              Get started
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
