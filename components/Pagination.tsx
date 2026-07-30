import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
};

function pageHref(basePath: string, page: number, searchParams?: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value) params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

// URL-driven pagination for server-rendered lists - 15 items per page.
export function Pagination({ currentPage, totalPages, basePath, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <Link
        href={pageHref(basePath, Math.max(1, currentPage - 1), searchParams)}
        aria-disabled={currentPage <= 1}
        className={`rounded-full border border-brand-grayPill px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${
          currentPage <= 1 ? "pointer-events-none text-brand-gray/40" : "text-brand-black hover:bg-brand-grayPill"
        }`}
      >
        Previous
      </Link>
      <span className="text-xs text-brand-gray">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={pageHref(basePath, Math.min(totalPages, currentPage + 1), searchParams)}
        aria-disabled={currentPage >= totalPages}
        className={`rounded-full border border-brand-grayPill px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${
          currentPage >= totalPages ? "pointer-events-none text-brand-gray/40" : "text-brand-black hover:bg-brand-grayPill"
        }`}
      >
        Next
      </Link>
    </div>
  );
}

export const PAGE_SIZE = 15;
