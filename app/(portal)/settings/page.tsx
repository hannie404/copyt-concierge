import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Settings</h1>

      <Card className="mt-8 max-w-2xl">
        <p className="font-display text-lg font-bold text-brand-black">Profile</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-xs font-bold uppercase tracking-wide text-brand-gray">
            Full name
            <input
              defaultValue="Annie Santos"
              className="mt-2 block w-full rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wide text-brand-gray">
            Email
            <input
              defaultValue="annie.business04@gmail.com"
              className="mt-2 block w-full rounded-full border border-brand-grayPill px-5 py-3 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
            />
          </label>
        </div>
      </Card>

      <Card className="mt-6 max-w-2xl">
        <p className="font-display text-lg font-bold text-brand-black">Payout method</p>
        <p className="mt-1 text-sm text-brand-gray">Connected via Stripe Connect.</p>
        <div className="mt-4 flex items-center justify-between rounded-card border border-brand-grayPill px-5 py-4">
          <span className="text-sm text-brand-black">Bank account •••• 4821</span>
          <button className="text-sm font-medium text-brand-magenta">Update</button>
        </div>
      </Card>

      <Card className="mt-6 max-w-2xl">
        <p className="font-display text-lg font-bold text-brand-black">Notifications</p>
        <div className="mt-4 space-y-3">
          {["Status changes", "New sale alerts", "Payout confirmations"].map((label) => (
            <label key={label} className="flex items-center justify-between text-sm">
              <span className="text-brand-black">{label}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-brand-magenta" />
            </label>
          ))}
        </div>
      </Card>

      <Button variant="primary" className="mt-8">
        Save changes
      </Button>
    </div>
  );
}
