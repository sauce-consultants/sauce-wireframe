"use client";

import { ContextMenu } from "@/components/ui";
import { Copy, Edit, Trash2, ExternalLink } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function ContextMenuShowcase() {
  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Context Menu</h1>
      <p className="text-text-muted mb-8">Right-click action list. Always provide a visible alternative.</p>

      <Section title="Right-Click Zone">
        <ContextMenu
          items={[
            { id: "edit", label: "Edit", icon: <Edit size={16} />, shortcut: "⌘E", onClick: () => {} },
            { id: "copy", label: "Copy", icon: <Copy size={16} />, shortcut: "⌘C", onClick: () => {} },
            { id: "open", label: "Open in new tab", icon: <ExternalLink size={16} />, onClick: () => {} },
            { type: "separator" },
            { id: "delete", label: "Delete", icon: <Trash2 size={16} />, destructive: true, onClick: () => {} },
          ]}
        >
          <div className="border-4 border-black p-12 text-center bg-gray-light/30">
            <p className="font-semibold">Right-click anywhere in this area</p>
            <p className="text-sm text-text-muted mt-1">A custom context menu will appear at your cursor position.</p>
          </div>
        </ContextMenu>
      </Section>
    </div>
  );
}
