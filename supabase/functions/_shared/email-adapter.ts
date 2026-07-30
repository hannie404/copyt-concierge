// Deno-side EmailAdapter (Edge Functions). Same mock/real split as
// _shared/platform-adapter.ts: Resend is the chosen provider (asked the
// user rather than assumed, per BUILD_PROMPTS.md Phase 9), but
// RESEND_API_KEY is confirmed unset in this project's demo, so
// MockEmailAdapter is what actually runs.

export interface EmailAdapter {
  send(message: { to: string; subject: string; body: string }): Promise<void>;
}

export class MockEmailAdapter implements EmailAdapter {
  async send(message: { to: string; subject: string; body: string }) {
    console.log(`[MockEmailAdapter] to=${message.to} subject="${message.subject}"`);
  }
}

// Never exercised in this project's demo (no RESEND_API_KEY), but a
// legitimate starting point, not a fake - same honesty standard as
// RealPlatformAdapter.
export class ResendEmailAdapter implements EmailAdapter {
  constructor(private apiKey: string) {}

  async send(message: { to: string; subject: string; body: string }) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Copyt Concierge <notifications@copyt-concierge.example.com>",
        to: message.to,
        subject: message.subject,
        text: message.body,
      }),
    });
    if (!res.ok) throw new Error(`Resend send failed: ${res.status}`);
  }
}

export function getEmailAdapter(): EmailAdapter {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (apiKey) return new ResendEmailAdapter(apiKey);
  return new MockEmailAdapter();
}
