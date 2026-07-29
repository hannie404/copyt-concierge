import type { ItemStatus } from "@/lib/queue-names";

const STATUS_LABELS: Record<ItemStatus, string> = {
  received: "Received",
  authenticating: "Authenticating",
  flagged: "Flagged",
  photographed: "Photographed",
  listed: "Listed",
  sold: "Sold",
  paid: "Paid",
};

// Each state gets its own color — see DESIGN.md's Status Pill component.
// "listed" is the only state that gets brand.magenta: per the One Signal
// Rule, magenta means "this is live," which is true precisely at that step.
const STATUS_DOT_COLORS: Record<ItemStatus, string> = {
  received: "bg-status-received",
  authenticating: "bg-status-authenticating",
  flagged: "bg-status-flagged",
  photographed: "bg-status-photographed",
  listed: "bg-status-listed",
  sold: "bg-status-sold",
  paid: "bg-status-paid",
};

type StatusPillProps = {
  status: ItemStatus;
};

// Colored dot + label, driven by ItemStatus — reused on /items and /items/:id
// per DESIGN.md's Status Pill signature component.
export function StatusPill({ status }: StatusPillProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-black">
      <span className={`h-2 w-2 rounded-full ${STATUS_DOT_COLORS[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}
