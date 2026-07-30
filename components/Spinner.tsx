// Shared loading indicator - used by every route group's loading.tsx.
// Next.js keeps the parent layout (nav shells) mounted and swaps only this
// in via Suspense while the new route's data loads.
export function Spinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-brand-grayPill border-t-brand-magenta"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
