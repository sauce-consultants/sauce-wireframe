import { TopNavShell } from "@/components/layouts";
import { Header, StatCard } from "@/components/ui";

export default function TopNavShellDemo() {
  return (
    <div className="border-4 border-black overflow-hidden" style={{ height: 500 }}>
      <TopNavShell
        nav={
          <Header
            logo={<span className="text-lg font-black tracking-tight">Acme App</span>}
            navItems={[
              { label: "Dashboard", href: "#", active: true },
              { label: "Projects", href: "#" },
              { label: "Team", href: "#" },
              { label: "Settings", href: "#" },
            ]}
          />
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Revenue" value="$42,580" />
          <StatCard label="Users" value="1,247" />
          <StatCard label="Orders" value="384" />
        </div>
        <div className="border-4 border-gray-light p-8 text-center text-text-muted text-sm">
          Content region — full width, constrained by max-w-screen-xl
        </div>
      </TopNavShell>
    </div>
  );
}
