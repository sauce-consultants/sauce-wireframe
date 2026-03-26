"use client";

import { IconButton } from "@/components/ui";
import { Copy, Edit, MoreVertical, Plus, Settings, Trash2, X } from "lucide-react";

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

export default function IconButtonShowcase() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Icon Button</h1>
      <p className="text-text-muted mb-8">
        Compact button using an icon as its only visible content.
      </p>

      <Section title="Variants">
        <div className="flex flex-wrap gap-4 items-center">
          <IconButton icon={<Settings size={20} />} aria-label="Settings" variant="default" />
          <IconButton icon={<Trash2 size={20} />} aria-label="Delete" variant="destructive" />
          <IconButton icon={<X size={20} />} aria-label="Close" variant="ghost" />
        </div>
      </Section>

      <Section title="Sizes">
        <div className="flex flex-wrap gap-4 items-center">
          <IconButton icon={<Plus size={16} />} aria-label="Add" size="sm" />
          <IconButton icon={<Plus size={20} />} aria-label="Add" size="md" />
          <IconButton icon={<Plus size={24} />} aria-label="Add" size="lg" />
        </div>
      </Section>

      <Section title="States">
        <div className="flex flex-wrap gap-4 items-center">
          <IconButton icon={<Edit size={20} />} aria-label="Edit" />
          <IconButton icon={<Edit size={20} />} aria-label="Edit" disabled />
          <IconButton icon={<Edit size={20} />} aria-label="Edit" loading />
        </div>
      </Section>

      <Section title="Toolbar Pattern">
        <div className="inline-flex border-4 border-black">
          <IconButton icon={<Edit size={20} />} aria-label="Edit" variant="ghost" />
          <IconButton icon={<Copy size={20} />} aria-label="Copy" variant="ghost" />
          <IconButton icon={<Trash2 size={20} />} aria-label="Delete" variant="ghost" />
          <IconButton icon={<MoreVertical size={20} />} aria-label="More actions" variant="ghost" />
        </div>
      </Section>
    </div>
  );
}
