import { Skeleton } from "@/components/ui";

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

export default function SkeletonShowcase() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Skeleton</h1>
      <p className="text-text-muted mb-8">
        Placeholder shapes rendered while content loads. Prevents layout shift.
      </p>

      <Section title="Primitives">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-mono text-text-muted mb-2">Text lines</p>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div>
            <p className="text-xs font-mono text-text-muted mb-2">Circle (avatar)</p>
            <Skeleton circle className="h-12 w-12" />
          </div>
          <div>
            <p className="text-xs font-mono text-text-muted mb-2">Rectangle (image)</p>
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </Section>

      <Section title="Card Skeleton">
        <div className="border-4 border-black p-4 space-y-3 max-w-sm">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </Section>

      <Section title="Table Skeleton">
        <div className="border-4 border-black">
          {/* Header */}
          <div className="flex gap-4 px-4 py-3 border-b-4 border-black">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          {/* Rows */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex gap-4 px-4 py-3 border-b-2 border-gray-light last:border-b-0"
            >
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Profile Skeleton">
        <div className="flex gap-4 items-start">
          <Skeleton circle className="h-16 w-16 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </Section>
    </div>
  );
}
