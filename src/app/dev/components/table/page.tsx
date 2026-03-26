"use client";

import { useState } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell,
  Badge, type SortDirection,
} from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

const data = [
  { id: "ORD-001", customer: "Acme Corp", amount: 12500, status: "Paid" },
  { id: "ORD-002", customer: "Globex Inc", amount: 8300, status: "Pending" },
  { id: "ORD-003", customer: "Wayne Enterprises", amount: 45000, status: "Paid" },
  { id: "ORD-004", customer: "Stark Industries", amount: 22100, status: "Overdue" },
  { id: "ORD-005", customer: "Umbrella Corp", amount: 6750, status: "Paid" },
];

const statusVariant = { Paid: "success" as const, Pending: "warning" as const, Overdue: "danger" as const };

export default function TableShowcase() {
  const [sort, setSort] = useState<{ col: string; dir: SortDirection }>({ col: "", dir: null });

  const toggleSort = (col: string) => {
    setSort((s) => {
      if (s.col !== col) return { col, dir: "asc" };
      if (s.dir === "asc") return { col, dir: "desc" };
      return { col: "", dir: null };
    });
  };

  const sorted = [...data].sort((a, b) => {
    if (!sort.dir || !sort.col) return 0;
    const m = sort.dir === "asc" ? 1 : -1;
    if (sort.col === "amount") return (a.amount - b.amount) * m;
    if (sort.col === "customer") return a.customer.localeCompare(b.customer) * m;
    return 0;
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Table</h1>
      <p className="text-text-muted mb-8">Structured data display with sorting, row hover, and status badges.</p>

      <Section title="Sortable Table">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Order</TableHeaderCell>
              <TableHeaderCell sortable sortDirection={sort.col === "customer" ? sort.dir : null} onSort={() => toggleSort("customer")}>
                Customer
              </TableHeaderCell>
              <TableHeaderCell sortable sortDirection={sort.col === "amount" ? sort.dir : null} onSort={() => toggleSort("amount")} numeric>
                Amount ($)
              </TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((row) => (
              <TableRow key={row.id}>
                <TableCell><span className="font-mono text-xs">{row.id}</span></TableCell>
                <TableCell><span className="font-semibold">{row.customer}</span></TableCell>
                <TableCell numeric>{row.amount.toLocaleString()}</TableCell>
                <TableCell><Badge variant={statusVariant[row.status as keyof typeof statusVariant]} dot>{row.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </div>
  );
}
