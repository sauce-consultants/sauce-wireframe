"use client";

import { DropdownMenu, Button, IconButton } from "@/components/ui";
import { Copy, Edit, MoreVertical, Share, Trash2 } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function DropdownMenuShowcase() {
  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Dropdown Menu</h1>
      <p className="text-text-muted mb-8">Action list triggered from a button. For commands, not form values.</p>

      <Section title="Basic">
        <DropdownMenu
          trigger={<Button variant="secondary">Actions</Button>}
          items={[
            { id: "edit", label: "Edit", icon: <Edit size={16} />, onClick: () => {} },
            { id: "copy", label: "Duplicate", icon: <Copy size={16} />, onClick: () => {} },
            { id: "share", label: "Share", icon: <Share size={16} />, onClick: () => {} },
            { type: "separator" },
            { id: "delete", label: "Delete", icon: <Trash2 size={16} />, destructive: true, onClick: () => {} },
          ]}
        />
      </Section>

      <Section title="Icon Trigger (Three-Dot)">
        <DropdownMenu
          trigger={<IconButton icon={<MoreVertical size={20} />} aria-label="More actions" variant="ghost" />}
          align="end"
          items={[
            { type: "label", label: "Actions" },
            { id: "edit", label: "Edit record", shortcut: "⌘E", onClick: () => {} },
            { id: "copy", label: "Copy link", shortcut: "⌘C", onClick: () => {} },
            { type: "separator" },
            { id: "archive", label: "Archive", onClick: () => {} },
            { id: "delete", label: "Delete", destructive: true, onClick: () => {} },
          ]}
        />
      </Section>

      <Section title="With Disabled Item">
        <DropdownMenu
          trigger={<Button variant="secondary">Options</Button>}
          items={[
            { id: "view", label: "View details", onClick: () => {} },
            { id: "export", label: "Export PDF", onClick: () => {} },
            { id: "locked", label: "Transfer ownership", disabled: true, onClick: () => {} },
          ]}
        />
      </Section>
    </div>
  );
}
