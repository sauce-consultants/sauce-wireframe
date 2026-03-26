import { Button, EmptyState } from "@/components/ui";
import { FileText, Inbox, Search } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function EmptyStateShowcase() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Empty State</h1>
      <p className="text-text-muted mb-8">
        Placeholder when a view has no data. Explains why and guides next action.
      </p>

      <Section title="First Use">
        <div className="border-4 border-black">
          <EmptyState
            icon={<FileText size={48} />}
            title="No projects yet"
            description="Create your first project to start tracking work. Projects help you organise tasks and collaborate with your team."
            action={<Button>Create Project</Button>}
          />
        </div>
      </Section>

      <Section title="No Search Results">
        <div className="border-4 border-black">
          <EmptyState
            icon={<Search size={48} />}
            title="No results for &quot;quantum flux&quot;"
            description="Try different keywords or clear your filters to see all records."
            action={<Button variant="secondary">Clear Filters</Button>}
          />
        </div>
      </Section>

      <Section title="Cleared / Archived">
        <div className="border-4 border-black">
          <EmptyState
            icon={<Inbox size={48} />}
            title="Inbox empty"
            description="You're all caught up. New notifications will appear here."
          />
        </div>
      </Section>
    </div>
  );
}
