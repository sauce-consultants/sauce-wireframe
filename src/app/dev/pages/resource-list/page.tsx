"use client";

import { useState } from "react";
import {
  Breadcrumbs, Button, Input, Badge,
  Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell,
  Pagination, EmptyState, Checkbox,
} from "@/components/ui";
import { Plus, Search } from "lucide-react";

const customers = [
  { id: "CUS-001", name: "Acme Corp", email: "hello@acme.com", status: "Active", revenue: 142580 },
  { id: "CUS-002", name: "Globex Inc", email: "info@globex.com", status: "Active", revenue: 83000 },
  { id: "CUS-003", name: "Wayne Enterprises", email: "bruce@wayne.com", status: "Active", revenue: 450000 },
  { id: "CUS-004", name: "Stark Industries", email: "tony@stark.com", status: "Pending", revenue: 221000 },
  { id: "CUS-005", name: "Umbrella Corp", email: "contact@umbrella.com", status: "Inactive", revenue: 67500 },
  { id: "CUS-006", name: "Cyberdyne Systems", email: "info@cyberdyne.com", status: "Active", revenue: 198000 },
  { id: "CUS-007", name: "Oscorp", email: "norman@oscorp.com", status: "Active", revenue: 312000 },
];

const statusVariant = { Active: "success" as const, Pending: "warning" as const, Inactive: "neutral" as const };

export default function ResourceListTemplate() {
  const [page, setPage] = useState(1);

  return (
    <div>
      {/* Page header */}
      <div className="mb-4">
        <Breadcrumbs items={[{ label: "Home", href: "#" }, { label: "Customers" }]} />
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl">Customers</h1>
        <Button leadingIcon={<Plus size={18} />}>Add Customer</Button>
      </div>

      {/* Filter bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <Input label="" placeholder="Search customers..." leadingAdornment={<Search size={18} />} />
        </div>
      </div>

      {/* Table */}
      <Table className="mb-4">
        <TableHead>
          <TableRow>
            <TableHeaderCell className="w-10"><Checkbox label="" /></TableHeaderCell>
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell sortable sortDirection="asc" onSort={() => {}}>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell numeric>Revenue ($)</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((c) => (
            <TableRow key={c.id}>
              <TableCell><Checkbox label="" /></TableCell>
              <TableCell><span className="font-mono text-xs">{c.id}</span></TableCell>
              <TableCell><span className="font-semibold">{c.name}</span></TableCell>
              <TableCell><span className="text-text-muted">{c.email}</span></TableCell>
              <TableCell><Badge variant={statusVariant[c.status as keyof typeof statusVariant]} dot>{c.status}</Badge></TableCell>
              <TableCell numeric>{c.revenue.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Pagination currentPage={page} totalPages={12} onPageChange={setPage} totalResults={286} pageSize={25} />
    </div>
  );
}
