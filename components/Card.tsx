import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "light" | "dark";
};

// Base content container — 16px radius per DESIGN.md's Two-Radius Rule.
// Never used on clickable elements; see Button/PillNavItem for those.
export function Card({ tone = "light", className = "", children, ...props }: CardProps) {
  const toneClasses =
    tone === "dark" ? "bg-brand-dark text-white" : "bg-white text-brand-black border border-brand-grayPill";

  return (
    <div className={`rounded-card p-5 ${toneClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}
