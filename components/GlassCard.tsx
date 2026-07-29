type GlassCardProps = {
  value: string;
  label: string;
  className?: string;
};

// Floating white stat overlay over a dark mockup background, per DESIGN.md's
// Glass Card signature component. Positioning (absolute/floating) is left to
// the consumer — this only owns the card's own look.
export function GlassCard({ value, label, className = "" }: GlassCardProps) {
  return (
    <div
      className={`w-fit rounded-card bg-white px-5 py-4 text-brand-black shadow-card-float ${className}`}
    >
      <div className="font-display text-2xl font-extrabold leading-none">{value}</div>
      <div className="mt-0.5 text-xs text-brand-gray">{label}</div>
    </div>
  );
}
