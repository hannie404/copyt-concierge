import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/actions/profile";
import { connectPayoutAccount } from "@/lib/actions/stripe-connect";
import { stripe } from "@/lib/stripe";

async function getPayoutAccountStatus(accountId: string | null) {
  if (!accountId) return null;
  const account = await stripe.accounts.retrieve(accountId);
  return { payoutsEnabled: account.payouts_enabled, detailsSubmitted: account.details_submitted };
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; stripeReturn?: string }>;
}) {
  const { saved, stripeReturn } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let name = "";
  let payoutMethodId: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, payout_method_id")
      .eq("id", user.id)
      .single();
    name = profile?.name ?? "";
    payoutMethodId = profile?.payout_method_id ?? null;
  }

  const payoutStatus = await getPayoutAccountStatus(payoutMethodId);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Settings</h1>

      {saved && (
        <p className="mt-4 max-w-2xl rounded-card bg-status-sold/10 px-4 py-3 text-sm text-status-sold">
          Changes saved.
        </p>
      )}
      {stripeReturn && !payoutStatus?.payoutsEnabled && (
        <p className="mt-4 max-w-2xl rounded-card bg-status-authenticating/10 px-4 py-3 text-sm text-status-authenticating">
          Almost there — Stripe still needs a bit more information before payouts can go out.
        </p>
      )}

      <form action={updateProfile}>
        <Card className="mt-8 max-w-2xl">
          <p className="font-display text-lg font-bold text-brand-black">Profile</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-xs font-bold uppercase tracking-wide text-brand-gray">
              Full name
              <input
                name="name"
                defaultValue={name}
                className="mt-2 block w-full rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wide text-brand-gray">
              Email
              <input
                defaultValue={user?.email ?? ""}
                disabled
                className="mt-2 block w-full rounded-full border border-brand-grayPill bg-brand-grayPill/50 px-5 py-3 text-sm text-brand-gray outline-none"
              />
            </label>
          </div>
        </Card>

        <Button type="submit" variant="primary" className="mt-6">
          Save changes
        </Button>
      </form>

      <Card className="mt-6 max-w-2xl">
        <p className="font-display text-lg font-bold text-brand-black">Payout method</p>
        <p className="mt-1 text-sm text-brand-gray">
          Payouts run weekly via Stripe Connect (test mode).
        </p>
        <div className="mt-4 flex items-center justify-between rounded-card border border-brand-grayPill px-5 py-4">
          {payoutStatus?.payoutsEnabled ? (
            <span className="text-sm font-medium text-status-sold">Connected</span>
          ) : payoutMethodId ? (
            <span className="text-sm text-status-authenticating">Onboarding incomplete</span>
          ) : (
            <span className="text-sm text-brand-gray">Not connected</span>
          )}
          {!payoutStatus?.payoutsEnabled && (
            <form action={connectPayoutAccount}>
              <Button type="submit" variant="outline" className="px-5 py-1.5 text-xs">
                {payoutMethodId ? "Finish setup" : "Connect payout account"}
              </Button>
            </form>
          )}
        </div>
      </Card>

      <Card className="mt-6 max-w-2xl">
        <p className="font-display text-lg font-bold text-brand-black">Notifications</p>
        <p className="mt-1 text-sm text-brand-gray">Coming in a later phase.</p>
        <div className="mt-4 space-y-3">
          {["Status changes", "New sale alerts", "Payout confirmations"].map((label) => (
            <label key={label} className="flex items-center justify-between text-sm opacity-50">
              <span className="text-brand-black">{label}</span>
              <input type="checkbox" defaultChecked disabled className="h-4 w-4 accent-brand-magenta" />
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
