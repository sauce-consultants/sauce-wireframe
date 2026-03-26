"use client";

import { useState } from "react";
import { CommandPalette, Button } from "@/components/ui";
import { FileText, Home, Plus, Search, Settings, Users } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function CommandPaletteShowcase() {
  const [open, setOpen] = useState(false);

  const items = [
    { id: "home", label: "Go to Dashboard", icon: <Home size={16} />, category: "Navigation", shortcut: "⌘H", onSelect: () => {} },
    { id: "projects", label: "Go to Projects", icon: <FileText size={16} />, category: "Navigation", onSelect: () => {} },
    { id: "team", label: "Go to Team", icon: <Users size={16} />, category: "Navigation", onSelect: () => {} },
    { id: "settings", label: "Go to Settings", icon: <Settings size={16} />, category: "Navigation", shortcut: "⌘,", onSelect: () => {} },
    { id: "create", label: "Create new project", icon: <Plus size={16} />, category: "Actions", shortcut: "⌘N", onSelect: () => {} },
    { id: "search", label: "Search records", icon: <Search size={16} />, category: "Actions", shortcut: "⌘K", onSelect: () => {} },
  ];

  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Command Palette</h1>
      <p className="text-text-muted mb-8">Keyboard-driven search and action launcher. Open with Cmd+K.</p>

      <Section title="Interactive">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open Command Palette
        </Button>
        <p className="text-xs text-text-muted mt-2">Or press <kbd className="font-mono border-2 border-gray-light px-1.5 py-0.5">⌘K</kbd></p>
        <CommandPalette open={open} onClose={() => setOpen(false)} items={items} />
      </Section>
    </div>
  );
}
