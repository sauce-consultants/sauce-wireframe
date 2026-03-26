"use client";

import {
  Breadcrumbs, StatCard, Card, CardHeader, CardBody,
  Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell,
  Badge, Timeline, Button,
} from "@/components/ui";
import { DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react";

export default function DashboardTemplate() {
  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl">Dashboard</h1>
          <p className="text-sm text-text-muted">Overview of key metrics and recent activity.</p>
        </div>
        <Button variant="secondary">Export</Button>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Revenue" value="$142,580" trend={{ value: "+12.3%", direction: "up" }} icon={<DollarSign size={20} />} />
        <StatCard label="Customers" value="8,429" trend={{ value: "+4.1%", direction: "up" }} icon={<Users size={20} />} />
        <StatCard label="Orders" value="1,247" trend={{ value: "-2.4%", direction: "down", positive: false }} icon={<ShoppingCart size={20} />} />
        <StatCard label="Conversion" value="3.2%" trend={{ value: "+0.8%", direction: "up" }} icon={<TrendingUp size={20} />} />
      </div>

      {/* Widget grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader><h3 className="font-extrabold">Revenue Overview</h3></CardHeader>
          <CardBody>
            <div className="h-48 bg-gray-light flex items-center justify-center text-sm text-text-muted font-mono">
              Chart placeholder
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader><h3 className="font-extrabold">Recent Orders</h3></CardHeader>
          <CardBody>
            <div className="space-y-3">
              {[
                { id: "#1042", customer: "Acme Corp", amount: "$1,200" },
                { id: "#1041", customer: "Globex Inc", amount: "$830" },
                { id: "#1040", customer: "Wayne Ent.", amount: "$4,500" },
                { id: "#1039", customer: "Stark Ind.", amount: "$2,210" },
              ].map((o) => (
                <div key={o.id} className="flex justify-between text-sm">
                  <span><span className="font-mono text-text-muted">{o.id}</span> {o.customer}</span>
                  <span className="font-mono font-bold">{o.amount}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Activity */}
      <Card>
        <CardHeader><h3 className="font-extrabold">Recent Activity</h3></CardHeader>
        <CardBody>
          <Timeline events={[
            { id: "1", title: "New customer registered", actor: "Acme Corp", timestamp: "2 hours ago" },
            { id: "2", title: "Order #1042 paid", actor: "Jane Smith", timestamp: "3 hours ago" },
            { id: "3", title: "Invoice #891 sent", actor: "System", timestamp: "5 hours ago" },
          ]} />
        </CardBody>
      </Card>
    </div>
  );
}
