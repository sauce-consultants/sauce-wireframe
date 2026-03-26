import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults?: number;
  pageSize?: number;
  className?: string;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
  pageSize,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const start = totalResults && pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const end = totalResults && pageSize ? Math.min(currentPage * pageSize, totalResults) : null;

  return (
    <nav aria-label="Pagination" className={`flex items-center justify-between gap-4 ${className}`}>
      {totalResults != null && start != null && end != null && (
        <span className="text-sm text-text-muted font-mono">
          {start}–{end} of {totalResults}
        </span>
      )}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="h-10 w-10 flex items-center justify-center border-4 border-black disabled:opacity-50 disabled:pointer-events-none hover:bg-gray-light transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span key={`e-${i}`} className="h-10 w-10 flex items-center justify-center text-text-muted">
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === currentPage ? "page" : undefined}
              aria-label={`Page ${p}`}
              className={`h-10 w-10 flex items-center justify-center text-sm font-semibold border-4 transition-colors ${
                p === currentPage
                  ? "border-black bg-black text-white"
                  : "border-transparent hover:bg-gray-light"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="h-10 w-10 flex items-center justify-center border-4 border-black disabled:opacity-50 disabled:pointer-events-none hover:bg-gray-light transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
}

export { Pagination, type PaginationProps };
