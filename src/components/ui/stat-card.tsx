import { type ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  trend?: { value: string; direction: "up" | "down"; positive?: boolean };
  icon?: ReactNode;
  className?: string;
}

function StatCard({ label, value, trend, icon, className = "" }: StatCardProps) {
  const isPositive = trend ? (trend.positive ?? trend.direction === "up") : false;

  return (
    <div className={`border-4 border-black bg-white p-5 ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </span>
        {icon && <span className="text-text-muted">{icon}</span>}
      </div>
      <p className="font-mono font-bold text-3xl mb-1">{value}</p>
      {trend && (
        <div
          className={`inline-flex items-center gap-1 text-sm font-semibold ${
            isPositive ? "text-success" : "text-danger"
          }`}
        >
          {trend.direction === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {trend.value}
        </div>
      )}
    </div>
  );
}

export { StatCard, type StatCardProps };
