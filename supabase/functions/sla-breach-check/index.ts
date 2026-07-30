// Supabase Edge Function: pg_cron-triggered, hourly. Flags items sitting in
// "received" or "authenticating" beyond a 48h SLA threshold. Logs findings -
// no dedicated breach-tracking table exists (and none is invented here);
// /admin/analytics's SLA stat stays mock-driven until Phase 11 wires real
// display. See SPEC.md §6.

import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const SLA_HOURS = 48;

Deno.serve(async () => {
  const threshold = new Date(Date.now() - SLA_HOURS * 60 * 60 * 1000).toISOString();

  const { data: items, error } = await supabase
    .from("items")
    .select("id, status, intake_at")
    .in("status", ["received", "authenticating"])
    .lt("intake_at", threshold);

  if (error) {
    console.error("[sla-breach-check] query failed", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
  }

  const breaches = (items ?? []).map((item) => {
    const hoursOverdue = Math.round(
      (Date.now() - new Date(item.intake_at).getTime()) / (60 * 60 * 1000) - SLA_HOURS
    );
    return { itemId: item.id, status: item.status, hoursOverdue };
  });

  if (breaches.length) {
    console.error("[sla-breach-check] SLA breaches:", breaches);
  }

  return new Response(JSON.stringify({ ok: true, breaches }), { status: 200 });
});
