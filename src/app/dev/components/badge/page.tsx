"use client";

import { useState } from "react";
import { Badge } from "@/components/ui";

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

export default function BadgeShowcase() {
  const [tags, setTags] = useState(["React", "TypeScript", "Tailwind", "Next.js"]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Badge</h1>
      <p className="text-text-muted mb-8">
        Small labelling element for status, categories, and counts.
      </p>

      <Section title="Status Variants">
        <div className="flex flex-wrap gap-3">
          <Badge variant="neutral">Draft</Badge>
          <Badge variant="accent">In Review</Badge>
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Expiring</Badge>
          <Badge variant="danger">Failed</Badge>
        </div>
      </Section>

      <Section title="With Dot">
        <div className="flex flex-wrap gap-3">
          <Badge variant="success" dot>Online</Badge>
          <Badge variant="neutral" dot>Offline</Badge>
          <Badge variant="warning" dot>Away</Badge>
          <Badge variant="danger" dot>Busy</Badge>
        </div>
      </Section>

      <Section title="Removable Tags">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="neutral"
              onRemove={() => setTags((t) => t.filter((x) => x !== tag))}
            >
              {tag}
            </Badge>
          ))}
          {tags.length === 0 && (
            <span className="text-sm text-text-muted">All tags removed.</span>
          )}
        </div>
      </Section>

      <Section title="In Context (Table Row)">
        <div className="border-4 border-black">
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-gray-light">
            <span className="font-semibold text-sm">Order #1001</span>
            <Badge variant="success">Delivered</Badge>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-gray-light">
            <span className="font-semibold text-sm">Order #1002</span>
            <Badge variant="warning">In Transit</Badge>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-semibold text-sm">Order #1003</span>
            <Badge variant="danger">Cancelled</Badge>
          </div>
        </div>
      </Section>
    </div>
  );
}
