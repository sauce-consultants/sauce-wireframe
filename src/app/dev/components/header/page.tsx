import { Header, Avatar } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

const navItems = [
  { label: "Dashboard", href: "#", active: true },
  { label: "Projects", href: "#" },
  { label: "Team", href: "#" },
  { label: "Reports", href: "#" },
  { label: "Settings", href: "#" },
];

export default function HeaderShowcase() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Header</h1>
      <p className="text-text-muted mb-8">Top-level navigation bar with branding, nav links, and user actions.</p>

      <Section title="Full Header">
        <div className="border-4 border-black overflow-hidden">
          <Header
            logo={<span className="text-lg font-black tracking-tight">Acme App</span>}
            navItems={navItems}
            actions={<Avatar name="Jane Smith" size="sm" />}
          />
        </div>
      </Section>

      <Section title="Minimal (Logo + Actions)">
        <div className="border-4 border-black overflow-hidden">
          <Header
            logo={<span className="text-lg font-black tracking-tight">Acme App</span>}
            actions={<Avatar name="Jane Smith" size="sm" />}
          />
        </div>
      </Section>
    </div>
  );
}
