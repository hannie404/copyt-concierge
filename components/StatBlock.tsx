type StatBlockProps = {
  value: string;
  label: string;
  tone?: "light" | "dark";
};

// Large bold number + small gray caption, no border, tight spacing.
export function StatBlock({ value, label, tone = "light" }: StatBlockProps) {
  return (
    <div className="flex flex-col">
      <span
        className={`font-display text-3xl font-extrabold leading-tight ${
          tone === "dark" ? "text-white" : "text-brand-black"
        }`}
      >
        {value}
      </span>
      <span className="mt-0.5 text-xs text-brand-gray">{label}</span>
    </div>
  );
}
