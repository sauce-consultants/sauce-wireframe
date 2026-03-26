import { DashboardGrid } from "@/components/layouts";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui";
import { DollarSign, Users, ShoppingCart } from "lucide-react";

export default function DashboardGridDemo() {
  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-6">Dashboard Grid</h2>

      {/* Stat row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Revenue" value="$142,580" trend={{ value: "+12%", direction: "up" }} icon={<DollarSign size={20} />} />
        <StatCard label="Users" value="8,429" trend={{ value: "+4%", direction: "up" }} icon={<Users size={20} />} />
        <StatCard label="Orders" value="1,247" trend={{ value: "-2%", direction: "down", positive: false }} icon={<ShoppingCart size={20} />} />
      </div>

      {/* Widget grid */}
      <DashboardGrid>
        <Card className="md:col-span-2">
          <CardHeader><h3 className="font-extrabold">Revenue Chart</h3></CardHeader>
          <CardBody><div className="h-40 bg-gray-light flex items-center justify-center text-sm text-text-muted font-mono">Chart placeholder</div></CardBody>
        </Card>
        <Card>
          <CardHeader><h3 className="font-extrabold">Recent Orders</h3></CardHeader>
          <CardBody><div className="h-40 bg-gray-light flex items-center justify-center text-sm text-text-muted font-mono">Table placeholder</div></CardBody>
        </Card>
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader><h3 className="font-extrabold">Activity Feed</h3></CardHeader>
          <CardBody><div className="h-32 bg-gray-light flex items-center justify-center text-sm text-text-muted font-mono">Full-width widget</div></CardBody>
        </Card>
      </DashboardGrid>
    </div>
  );
}
