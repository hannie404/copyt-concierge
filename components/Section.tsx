import type { HTMLAttributes } from "react";

type SectionProps = HTMLAttributes<HTMLElement> & {
  tone?: "light" | "dark";
};

// Full-bleed section wrapper — the light/dark alternation is the core
// marketing-page rhythm per DESIGN.md Layout.
export function Section({ tone = "light", className = "", children, ...props }: SectionProps) {
  const toneClasses = tone === "dark" ? "bg-brand-dark text-white" : "bg-white text-brand-black";

  return (
    <section className={`w-full px-6 py-16 md:py-24 ${toneClasses} ${className}`} {...props}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
