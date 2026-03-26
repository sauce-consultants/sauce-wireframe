import { Sidebar, Avatar } from "@/components/ui";
import { Home, FolderOpen, Users, BarChart3, Settings, HelpCircle } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function SidebarShowcase() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Sidebar</h1>
      <p className="text-text-muted mb-8">Vertical navigation panel for deep hierarchies and admin interfaces.</p>

      <Section title="With Icons & Sub-items">
        <div className="border-4 border-black h-96 overflow-hidden">
          <Sidebar
            header={<span className="text-lg font-black tracking-tight">Acme App</span>}
            items={[
              { label: "Dashboard", href: "#", icon: <Home size={18} />, active: true },
              {
                label: "Projects", href: "#", icon: <FolderOpen size={18} />,
                children: [
                  { label: "All Projects", href: "#" },
                  { label: "Archived", href: "#" },
                ],
              },
              { label: "Team", href: "#", icon: <Users size={18} /> },
              { label: "Reports", href: "#", icon: <BarChart3 size={18} /> },
              { label: "Settings", href: "#", icon: <Settings size={18} /> },
            ]}
            footer={
              <div className="flex items-center gap-3">
                <Avatar name="Jane Smith" size="sm" />
                <span className="text-sm font-semibold">Jane Smith</span>
              </div>
            }
          />
        </div>
      </Section>
    </div>
  );
}
