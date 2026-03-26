import { SidebarShell } from "@/components/layouts";
import { Breadcrumbs, StatCard } from "@/components/ui";
import { Home, FolderOpen, Users, BarChart3, Settings } from "lucide-react";

export default function SidebarShellDemo() {
  return (
    <div className="border-4 border-black overflow-hidden" style={{ height: 500 }}>
      <SidebarShell
        sidebar={
          <nav className="flex flex-col gap-0.5 p-3">
            {[
              { icon: <Home size={18} />, label: "Dashboard", active: true },
              { icon: <FolderOpen size={18} />, label: "Projects" },
              { icon: <Users size={18} />, label: "Team" },
              { icon: <BarChart3 size={18} />, label: "Reports" },
              { icon: <Settings size={18} />, label: "Settings" },
            ].map((item) => (
              <span
                key={item.label}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-semibold ${
                  item.active ? "bg-black text-white" : "text-text-secondary hover:bg-gray-light"
                }`}
              >
                {item.icon}
                {item.label}
              </span>
            ))}
          </nav>
        }
        header={
          <div className="flex items-center justify-between">
            <Breadcrumbs items={[{ label: "Home", href: "#" }, { label: "Dashboard" }]} />
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Revenue" value="$42,580" />
          <StatCard label="Users" value="1,247" />
          <StatCard label="Orders" value="384" />
        </div>
        <div className="border-4 border-gray-light p-8 text-center text-text-muted text-sm">
          Content region — page patterns render here
        </div>
      </SidebarShell>
    </div>
  );
}
