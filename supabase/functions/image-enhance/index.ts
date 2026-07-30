// Supabase Edge Function: Database-Webhook-equivalent trigger fires this on
// every insert into storage.objects for the 'item-photos' bucket (see
// 00011_phase9.sql). Stubs the actual image enhancement call - real
// processing is out of scope for MVP - but wires the trigger and job
// logging for real, per BUILD_PROMPTS.md Phase 9. See SPEC.md §6,
// 00004_storage.sql for the bucket's {user_id}/{item_id}/... path layout.

import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  let objectPath: string | null = null;
  try {
    const body = await req.json();
    objectPath = body?.record?.name ?? null;
  } catch {
    // No/invalid body - log with no path rather than throwing.
  }

  const rawItemId = objectPath?.split("/")[1] ?? null;
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const itemId = rawItemId && UUID_RE.test(rawItemId) ? rawItemId : null;

  console.log(`[image-enhance] stub enhancement for ${objectPath ?? "(unknown object)"}`);

  // item_id has a foreign key to items(id) - only pass it through when it
  // parses as a real uuid, so a malformed/unexpected object path logs a job
  // with item_id: null instead of failing the insert on an FK violation.
  await supabase.from("queue_job_log").insert({
    queue_name: "item-photos-webhook",
    job_type: "image-enhance",
    item_id: itemId,
    status: "stubbed",
  });

  return new Response(JSON.stringify({ ok: true, itemId }), { status: 200 });
});
