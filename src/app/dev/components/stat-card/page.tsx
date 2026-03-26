import { StatCard } from "@/components/ui";
import { DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function StatCardShowcase() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Stat Card</h1>
      <p className="text-text-muted mb-8">Key metric display for dashboards and summary views.</p>

      <Section title="Dashboard Row">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Revenue"
            value="$142,580"
            trend={{ value: "+12.3%", direction: "up" }}
            icon={<DollarSign size={20} />}
          />
          <StatCard
            label="Users"
            value="8,429"
            trend={{ value: "+4.1%", direction: "up" }}
            icon={<Users size={20} />}
          />
          <StatCard
            label="Orders"
            value="1,247"
            trend={{ value: "-2.4%", direction: "down", positive: false }}
            icon={<ShoppingCart size={20} />}
          />
          <StatCard
            label="Conversion"
            value="3.2%"
            trend={{ value: "+0.8%", direction: "up" }}
            icon={<TrendingUp size={20} />}
          />
        </div>
      </Section>

      <Section title="Simple (No Trend)">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Open Tickets" value="42" />
          <StatCard label="Avg Response" value="2.4h" />
          <StatCard label="Satisfaction" value="94%" />
        </div>
      </Section>
    </div>
  );
}
