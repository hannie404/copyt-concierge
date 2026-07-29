import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { QUEUE_NAMES } from "@/lib/queue-names";

// Rule (CLAUDE.md): never process a webhook synchronously. Verify signature,
// enqueue to pgmq, return 200 fast. Real processing happens in the
// webhook-ingest Supabase Edge Function (Phase 7).
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const payload = await req.json();

  // TODO: verify webhook signature per platform (StockX/eBay/Whatnot) before
  // enqueueing - stubbed until sandbox credentials are available (see
  // BUILD_PROMPTS.md "what I need from you").

  const supabase = await createClient();
  const { error } = await supabase.schema("pgmq_public").rpc("send", {
    queue_name: QUEUE_NAMES.webhookIngest,
    message: { platform, payload, receivedAt: new Date().toISOString() },
  });

  if (error) {
    console.error("[webhook-ingest] enqueue failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
