// Supabase Edge Function: consumes notify-status-change and emails the
// consignor on each real pipeline stage transition. See SPEC.md §6, Phase 9.
//
// Fixes a real bug from the Phase 4/scaffold stub: it called
// supabase.schema("pgmq_public").rpc("pop", ...), but the pgmq_public schema
// was confirmed (Phase 7) to never exist - every other consumer uses the
// public.pgmq_pop wrapper RPC instead. This function would have 500'd on
// every invocation.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { getEmailAdapter } from "../_shared/email-adapter.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const SUBJECT_BY_STATUS: Record<string, string> = {
  authenticating: "Your item is being authenticated",
  photographed: "Your item passed authentication",
  flagged: "Your item was flagged for review",
  listed: "Your item is now listed",
  sold: "Your item sold!",
  paid: "You've been paid out",
};

async function logJob(itemId: string | null, status: string, error?: string) {
  await supabase.from("queue_job_log").insert({
    queue_name: "notify-status-change",
    job_type: "notify-status-change",
    item_id: itemId,
    status,
    error: error ?? null,
  });
}

Deno.serve(async () => {
  const { data, error } = await supabase.rpc("pgmq_pop", { queue_name: "notify-status-change" });

  if (error) {
    console.error("[notify-status-change] pop failed", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
  }
  if (!data?.length) {
    return new Response(JSON.stringify({ ok: true, processed: 0 }), { status: 200 });
  }

  const { message } = data[0];
  const { itemId, toStatus } = message as { itemId: string; toStatus: string };

  const { data: item } = await supabase
    .from("items")
    .select("description, user_id")
    .eq("id", itemId)
    .single();

  if (!item) {
    await logJob(itemId, "failed", "item not found");
    return new Response(JSON.stringify({ ok: true, skipped: "item not found" }), { status: 200 });
  }

  const { data: userData, error: userError } = await supabase.auth.admin.getUserById(item.user_id);
  if (userError || !userData?.user?.email) {
    await logJob(itemId, "failed", userError?.message ?? "consignor email not found");
    return new Response(JSON.stringify({ ok: true, skipped: "no consignor email" }), { status: 200 });
  }

  const subject = SUBJECT_BY_STATUS[toStatus] ?? `Update on your item: ${toStatus}`;
  const body = `${item.description} is now "${toStatus}". Check your dashboard for details.`;

  try {
    await getEmailAdapter().send({ to: userData.user.email, subject, body });
    await logJob(itemId, "sent");
  } catch (sendError) {
    await logJob(itemId, "failed", sendError instanceof Error ? sendError.message : String(sendError));
  }

  return new Response(JSON.stringify({ ok: true, processed: 1 }), { status: 200 });
});
