"use client";

import {
  Breadcrumbs, Badge, Button, Card, CardHeader, CardBody,
  Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell,
  Timeline, DropdownMenu,
} from "@/components/ui";
import { Edit, MoreVertical, Archive, Trash2, Mail } from "lucide-react";
import { MainAside } from "@/components/layouts";
import { CustomerAside } from "../_shared/customer-aside";

export default function ResourceDetailTemplate() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-4">
        <Breadcrumbs items={[
          { label: "Home", href: "#" },
          { label: "Customers", href: "#" },
          { label: "Acme Corp" },
        ]} />
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl">Acme Corp</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" leadingIcon={<Edit size={16} />}>Edit</Button>
          <DropdownMenu
            trigger={<Button variant="ghost" leadingIcon={<MoreVertical size={16} />} />}
            align="end"
            items={[
              { id: "email", label: "Send email", icon: <Mail size={16} />, onClick: () => {} },
              { id: "archive", label: "Archive", icon: <Archive size={16} />, onClick: () => {} },
              { type: "separator" },
              { id: "delete", label: "Delete customer", icon: <Trash2 size={16} />, destructive: true, onClick: () => {} },
            ]}
          />
        </div>
      </div>

      <MainAside aside={<CustomerAside />}>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold">Recent Orders</h3>
              <Button variant="link" size="sm">View all</Button>
            </div>
          </CardHeader>
          <CardBody>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Order</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell numeric>Total</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { id: "#1042", date: "25 Mar 2026", total: "$1,200", status: "Paid" },
                  { id: "#1039", date: "20 Mar 2026", total: "$830", status: "Pending" },
                  { id: "#1035", date: "14 Mar 2026", total: "$2,400", status: "Paid" },
                ].map((o) => (
                  <TableRow key={o.id}>
                    <TableCell><span className="font-mono text-xs">{o.id}</span></TableCell>
                    <TableCell>{o.date}</TableCell>
                    <TableCell numeric>{o.total}</TableCell>
                    <TableCell>
                      <Badge variant={o.status === "Paid" ? "success" : "warning"}>{o.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h3 className="font-extrabold">Activity</h3></CardHeader>
          <CardBody>
            <Timeline events={[
              { id: "1", title: "Order #1042 placed", timestamp: "25 Mar 2026, 09:15" },
              { id: "2", title: "Contact details updated", actor: "Jane Smith", timestamp: "20 Mar 2026, 14:30" },
              { id: "3", title: "Customer created", actor: "System", timestamp: "14 Mar 2024, 10:00" },
            ]} />
          </CardBody>
        </Card>
      </MainAside>
    </div>
  );
}
