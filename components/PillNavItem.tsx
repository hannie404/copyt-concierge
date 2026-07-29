type PillNavItemProps = {
  children: React.ReactNode;
  active?: boolean;
};

// Light-gray rounded nav dropdown trigger, per DESIGN.md Components > Pill Nav Item.
export function PillNavItem({ children, active = false }: PillNavItemProps) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta focus-visible:ring-offset-2 ${
        active
          ? "bg-brand-magenta text-white"
          : "bg-brand-grayPill text-brand-black hover:bg-brand-gray/20"
      }`}
    >
      {children}
    </button>
  );
}
