import { Breadcrumbs } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function BreadcrumbsShowcase() {
  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Breadcrumbs</h1>
      <p className="text-text-muted mb-8">Hierarchical trail for navigation context and quick backtracking.</p>

      <Section title="Standard">
        <Breadcrumbs items={[
          { label: "Home", href: "#" },
          { label: "Projects", href: "#" },
          { label: "Project Alpha", href: "#" },
          { label: "Settings" },
        ]} />
      </Section>

      <Section title="Short">
        <Breadcrumbs items={[
          { label: "Customers", href: "#" },
          { label: "Acme Corp" },
        ]} />
      </Section>

      <Section title="Deep Hierarchy">
        <Breadcrumbs items={[
          { label: "Home", href: "#" },
          { label: "Workspace", href: "#" },
          { label: "Projects", href: "#" },
          { label: "Alpha", href: "#" },
          { label: "Tasks", href: "#" },
          { label: "Task #42" },
        ]} />
      </Section>
    </div>
  );
}
