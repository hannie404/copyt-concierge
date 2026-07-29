import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
  tone?: "light" | "dark";
  arrow?: boolean;
  uppercase?: boolean;
};

// Per DESIGN.md: always rounded-full, never any other radius.
export function Button({
  variant = "primary",
  tone = "light",
  arrow = false,
  uppercase = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-display font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta focus-visible:ring-offset-2";

  const variantClasses =
    variant === "primary"
      ? "bg-brand-magenta text-white hover:bg-brand-magentaHover"
      : tone === "dark"
        ? "border-2 border-white text-white hover:bg-white/10 focus-visible:ring-offset-brand-dark"
        : "border-2 border-brand-black text-brand-black hover:bg-brand-black/5";

  const caseClasses = uppercase ? "uppercase tracking-wide" : "";

  return (
    <button className={`${base} ${variantClasses} ${caseClasses} ${className}`} {...props}>
      {children}
      {arrow && <span aria-hidden="true">&rarr;</span>}
    </button>
  );
}
