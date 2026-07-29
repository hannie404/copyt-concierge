// Supabase Edge Function: consumes notify-status-change and sends an email/SMS
// on each pipeline stage transition. Provider TBD - see BUILD_PROMPTS.md Phase 9
// ("ask me which provider before assuming one").

import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async () => {
  const { data, error } = await supabase
    .schema("pgmq_public")
    .rpc("pop", { queue_name: "notify-status-change" });

  if (error || !data?.length) {
    return new Response(JSON.stringify({ ok: true, processed: 0 }), { status: 200 });
  }

  const { message } = data[0];
  const { itemId, toStatus } = message as { itemId: string; toStatus: string };

  // TODO: send via chosen email/SMS provider (Phase 9).
  console.log(`[notify] item=${itemId} -> ${toStatus}`);

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
