import { Avatar, AvatarGroup } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function AvatarShowcase() {
  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Avatar</h1>
      <p className="text-text-muted mb-8">Visual identity for users and entities. Image, initials, or placeholder.</p>

      <Section title="Sizes">
        <div className="flex items-end gap-4">
          <div className="flex flex-col items-center gap-1">
            <Avatar name="Jane Smith" size="xs" />
            <span className="text-xs font-mono text-text-muted">xs</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Avatar name="Jane Smith" size="sm" />
            <span className="text-xs font-mono text-text-muted">sm</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Avatar name="Jane Smith" size="md" />
            <span className="text-xs font-mono text-text-muted">md</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Avatar name="Jane Smith" size="lg" />
            <span className="text-xs font-mono text-text-muted">lg</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Avatar name="Jane Smith" size="xl" />
            <span className="text-xs font-mono text-text-muted">xl</span>
          </div>
        </div>
      </Section>

      <Section title="Fallbacks">
        <div className="flex items-center gap-4">
          <Avatar name="Jane Smith" />
          <Avatar name="Bob" />
          <Avatar />
        </div>
        <p className="text-xs text-text-muted mt-2">Initials &rarr; Initials (single) &rarr; Placeholder icon</p>
      </Section>

      <Section title="With Status">
        <div className="flex items-center gap-4">
          <Avatar name="Alice" status="online" />
          <Avatar name="Bob" status="away" />
          <Avatar name="Carol" status="busy" />
          <Avatar name="Dan" status="offline" />
        </div>
      </Section>

      <Section title="Group / Stack">
        <AvatarGroup>
          {["Alice W", "Bob X", "Carol Y", "Dan Z", "Eve Q", "Frank R"].map((name) => (
            <Avatar key={name} name={name} size="md" />
          ))}
        </AvatarGroup>
      </Section>
    </div>
  );
}
