"use client";

import { useState } from "react";
import {
  Breadcrumbs, Button, Badge, Input,
  Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell,
  Pagination,
} from "@/components/ui";
import { Plus, Search } from "lucide-react";
import { MainAside } from "@/components/layouts";
import { CustomerAside } from "../_shared/customer-aside";

const orders = [
  { id: "#1042", date: "25 Mar 2026", total: 1200, status: "Paid" },
  { id: "#1039", date: "20 Mar 2026", total: 830, status: "Pending" },
  { id: "#1035", date: "14 Mar 2026", total: 2400, status: "Paid" },
  { id: "#1028", date: "05 Mar 2026", total: 950, status: "Paid" },
  { id: "#1021", date: "22 Feb 2026", total: 3200, status: "Refunded" },
];

const statusVariant = { Paid: "success" as const, Pending: "warning" as const, Refunded: "danger" as const };

export default function HasManyListTemplate() {
  const [page, setPage] = useState(1);

  return (
    <div>
      {/* Page header */}
      <div className="mb-4">
        <Breadcrumbs items={[
          { label: "Home", href: "#" },
          { label: "Customers", href: "#" },
          { label: "Acme Corp", href: "#" },
          { label: "Orders" },
        ]} />
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl">Orders for Acme Corp</h1>
        <Button leadingIcon={<Plus size={18} />}>Create Order</Button>
      </div>

      <MainAside aside={<CustomerAside />}>
        {/* Filter bar */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 max-w-sm">
            <Input label="" placeholder="Search orders..." leadingAdornment={<Search size={18} />} />
          </div>
        </div>

        {/* Table */}
        <Table className="mb-4">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Order</TableHeaderCell>
              <TableHeaderCell sortable sortDirection="desc" onSort={() => {}}>Date</TableHeaderCell>
              <TableHeaderCell numeric>Total ($)</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell><span className="font-mono text-xs">{o.id}</span></TableCell>
                <TableCell>{o.date}</TableCell>
                <TableCell numeric>{o.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[o.status as keyof typeof statusVariant]} dot>{o.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination currentPage={page} totalPages={3} onPageChange={setPage} totalResults={67} pageSize={25} />
      </MainAside>
    </div>
  );
}
