import type { Platform } from "@/lib/queue-names";

// Node-side PlatformAdapter (Next.js app). See also the Deno-side twin at
// supabase/functions/_shared/platform-adapter.ts - two runtimes with
// different env-access mechanisms (process.env vs Deno.env), so this is
// deliberately duplicated rather than shared, matching the same interface.

export interface PlatformAdapter {
  publish(listing: { sku: string; description: string; price: number }): Promise<{ externalId: string }>;
  delist(externalId: string): Promise<void>;
  getComps(sku: string): Promise<{ price: number }[]>;
}

// Deterministic-ish hash so repeated getComps() calls for the same SKU look
// consistent in a demo, rather than jumping around randomly on every call.
function hashSku(sku: string): number {
  let hash = 0;
  for (let i = 0; i < sku.length; i++) {
    hash = (hash * 31 + sku.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export class MockPlatformAdapter implements PlatformAdapter {
  constructor(private platform: Platform) {}

  async publish(listing: { sku: string; description: string; price: number }) {
    return { externalId: `MOCK-${this.platform}-${listing.sku}-${Math.random().toString(36).slice(2, 8)}` };
  }

  async delist(externalId: string) {
    console.log(`[MockPlatformAdapter:${this.platform}] delisted ${externalId}`);
  }

  async getComps(sku: string) {
    const base = 40 + (hashSku(sku) % 400);
    return [0.9, 0.97, 1.0, 1.05, 1.12].map((mult) => ({ price: Math.round(base * mult) }));
  }
}

// Thin wrapper around a real platform API. Never exercised in this project's
// demo (STOCKX_API_KEY/EBAY_API_KEY/WHATNOT_API_KEY are confirmed unset), but
// written as a legitimate starting point per platform, not a fake - same
// honesty standard as the webhook signature-verification TODO in
// app/api/webhooks/[platform]/route.ts. Endpoint shapes are placeholders
// pending real per-platform API docs.
export class RealPlatformAdapter implements PlatformAdapter {
  constructor(
    private platform: Platform,
    private apiKey: string
  ) {}

  async publish(listing: { sku: string; description: string; price: number }) {
    const res = await fetch(`https://api.${this.platform}.example.com/listings`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(listing),
    });
    if (!res.ok) throw new Error(`${this.platform} publish failed: ${res.status}`);
    const data = await res.json();
    return { externalId: data.id };
  }

  async delist(externalId: string) {
    const res = await fetch(`https://api.${this.platform}.example.com/listings/${externalId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
    if (!res.ok) throw new Error(`${this.platform} delist failed: ${res.status}`);
  }

  async getComps(sku: string) {
    const res = await fetch(`https://api.${this.platform}.example.com/comps?sku=${sku}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
    if (!res.ok) throw new Error(`${this.platform} getComps failed: ${res.status}`);
    return res.json();
  }
}

const ENV_VAR_BY_PLATFORM: Record<Exclude<Platform, "pos">, string> = {
  stockx: "STOCKX_API_KEY",
  ebay: "EBAY_API_KEY",
  whatnot: "WHATNOT_API_KEY",
};

export function getAdapterMode(platform: Platform): "mock" | "real" {
  if (platform === "pos") return "mock";
  return process.env[ENV_VAR_BY_PLATFORM[platform]] ? "real" : "mock";
}

export function getAdapter(platform: Platform): PlatformAdapter {
  if (platform !== "pos") {
    const apiKey = process.env[ENV_VAR_BY_PLATFORM[platform]];
    if (apiKey) return new RealPlatformAdapter(platform, apiKey);
  }
  return new MockPlatformAdapter(platform);
}
