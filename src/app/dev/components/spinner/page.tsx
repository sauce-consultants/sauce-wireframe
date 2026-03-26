import { Spinner } from "@/components/ui";

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

export default function SpinnerShowcase() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Spinner</h1>
      <p className="text-text-muted mb-8">
        Indeterminate loading indicator for localised areas.
      </p>

      <Section title="Sizes">
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Spinner size={16} />
            <span className="text-xs font-mono text-text-muted">16px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size={20} />
            <span className="text-xs font-mono text-text-muted">20px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size={32} />
            <span className="text-xs font-mono text-text-muted">32px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size={48} />
            <span className="text-xs font-mono text-text-muted">48px</span>
          </div>
        </div>
      </Section>

      <Section title="With Label">
        <div className="space-y-4">
          <Spinner label="Loading..." />
          <Spinner size={32} label="Fetching records..." />
        </div>
      </Section>

      <Section title="Colour Inheritance">
        <div className="flex items-center gap-8">
          <span className="text-black"><Spinner size={24} /></span>
          <span className="text-accent"><Spinner size={24} /></span>
          <span className="text-danger"><Spinner size={24} /></span>
          <span className="text-gray-mid"><Spinner size={24} /></span>
        </div>
      </Section>

      <Section title="Page Loading Pattern">
        <div className="border-4 border-black p-12 flex flex-col items-center justify-center gap-3">
          <Spinner size={32} />
          <span className="text-sm text-text-muted">Loading dashboard...</span>
        </div>
      </Section>
    </div>
  );
}
