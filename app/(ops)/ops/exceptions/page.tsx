import { Card } from "@/components/Card";
import { createClient } from "@/lib/supabase/server";

async function getFlaggedItems() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("items")
    .select("id, description")
    .eq("status", "flagged");

  if (!items?.length) return [];

  const { data: events } = await supabase
    .from("pipeline_events")
    .select("item_id, actor, created_at")
    .eq("to_status", "flagged")
    .in(
      "item_id",
      items.map((i) => i.id)
    )
    .order("created_at", { ascending: false });

  const latestEventByItem = new Map<string, { actor: string; created_at: string }>();
  for (const e of events ?? []) {
    if (!latestEventByItem.has(e.item_id)) latestEventByItem.set(e.item_id, e);
  }

  const actorIds = [...latestEventByItem.values()].map((e) => e.actor).filter((a) => a !== "system");
  const { data: profiles } = actorIds.length
    ? await supabase.from("profiles").select("id, name").in("id", actorIds)
    : { data: [] };
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.name]));

  return items.map((item) => {
    const event = latestEventByItem.get(item.id);
    return {
      id: item.id,
      item: item.description,
      flaggedAt: event ? new Date(event.created_at).toLocaleDateString() : "Unknown",
      flaggedBy: !event ? "Unknown" : event.actor === "system" ? "System" : (nameById.get(event.actor) ?? "Staff"),
    };
  });
}

export default async function OpsExceptionsPage() {
  const exceptions = await getFlaggedItems();

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-black">Exceptions</h1>
      <p className="mt-1 text-sm text-brand-gray">
        Items flagged for review during authentication.
      </p>

      <Card className="mt-6">
        <div className="divide-y divide-brand-grayPill">
          {exceptions.map((exc) => (
            <div key={exc.id} className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
              <div className="min-w-0">
                <p className="font-medium text-brand-black">{exc.item}</p>
                <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-status-flagged">
                  <span className="h-1.5 w-1.5 rounded-full bg-status-flagged" />
                  Flagged during authentication review
                </p>
              </div>
              <div className="text-right text-xs text-brand-gray">
                <p>Flagged {exc.flaggedAt}</p>
                <p>by {exc.flaggedBy}</p>
              </div>
            </div>
          ))}
          {exceptions.length === 0 && (
            <p className="py-6 text-center text-sm text-brand-gray">No open exceptions.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
