"use client";

const DEMO_ACCOUNTS = {
  consignor: { email: "demo.consignor@copyt-concierge.test", password: "DemoPass123!" },
  staff: { email: "demo.staff@copyt-concierge.test", password: "DemoPass123!" },
} as const;

// Demo convenience only - fills the (uncontrolled) email/password inputs
// below by id rather than lifting the whole form into client state.
export function DemoCredentialsPicker() {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const key = e.target.value as keyof typeof DEMO_ACCOUNTS | "";
    if (!key) return;

    const account = DEMO_ACCOUNTS[key];
    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const passwordInput = document.getElementById("password") as HTMLInputElement | null;
    if (emailInput) emailInput.value = account.email;
    if (passwordInput) passwordInput.value = account.password;
  }

  return (
    <label className="mt-6 block text-xs font-bold uppercase tracking-wide text-brand-gray">
      Demo account
      <div className="relative mt-2">
        <select
          defaultValue=""
          onChange={handleChange}
          className="block w-full appearance-none rounded-full border border-brand-grayPill bg-white px-5 py-3 pr-11 text-sm text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta"
        >
          <option value="">Fill in demo credentials…</option>
          <option value="consignor">Consignor demo</option>
          <option value="staff">Staff / Admin demo</option>
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray"
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </label>
  );
}
