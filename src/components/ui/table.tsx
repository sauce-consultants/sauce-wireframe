"use client";

import { type ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

/* -----------------------------------------------------------------------
   Table primitives
   ----------------------------------------------------------------------- */

function Table({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-x-auto border-4 border-black ${className}`}>
      <table className="min-w-full">{children}</table>
    </div>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return <thead className="border-b-4 border-black">{children}</thead>;
}

function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y-2 divide-gray-light">{children}</tbody>;
}

function TableRow({
  children,
  selected = false,
  className = "",
}: {
  children: ReactNode;
  selected?: boolean;
  className?: string;
}) {
  return (
    <tr
      className={`
        hover:bg-gray-light/50 transition-colors
        ${selected ? "bg-accent/5" : ""}
        ${className}
      `}
    >
      {children}
    </tr>
  );
}

type SortDirection = "asc" | "desc" | null;

function TableHeaderCell({
  children,
  sortable = false,
  sortDirection = null,
  onSort,
  numeric = false,
  className = "",
}: {
  children: ReactNode;
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
  numeric?: boolean;
  className?: string;
}) {
  const align = numeric ? "text-right" : "text-left";

  if (sortable) {
    return (
      <th
        scope="col"
        className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted ${align} ${className}`}
        aria-sort={sortDirection === "asc" ? "ascending" : sortDirection === "desc" ? "descending" : "none"}
      >
        <button
          type="button"
          onClick={onSort}
          className="inline-flex items-center gap-1 hover:text-black transition-colors"
        >
          {children}
          {sortDirection === "asc" && <ArrowUp size={14} />}
          {sortDirection === "desc" && <ArrowDown size={14} />}
          {!sortDirection && <span className="w-3.5" />}
        </button>
      </th>
    );
  }

  return (
    <th
      scope="col"
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted ${align} ${className}`}
    >
      {children}
    </th>
  );
}

function TableCell({
  children,
  numeric = false,
  className = "",
}: {
  children: ReactNode;
  numeric?: boolean;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 text-sm ${numeric ? "text-right font-mono tabular-nums" : ""} ${className}`}>
      {children}
    </td>
  );
}

export {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  type SortDirection,
};
