"use client";

import { Tooltip, IconButton } from "@/components/ui";
import { Copy, Edit, Settings, Trash2 } from "lucide-react";

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

export default function TooltipShowcase() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Tooltip</h1>
      <p className="text-text-muted mb-8">
        Contextual hint on hover/focus. 200ms delay, non-interactive.
      </p>

      <Section title="Positions">
        <div className="flex flex-wrap gap-8 items-center py-8">
          <Tooltip content="Tooltip above" position="top">
            <span className="px-3 py-2 border-4 border-black text-sm font-semibold cursor-default">
              Top
            </span>
          </Tooltip>
          <Tooltip content="Tooltip below" position="bottom">
            <span className="px-3 py-2 border-4 border-black text-sm font-semibold cursor-default">
              Bottom
            </span>
          </Tooltip>
          <Tooltip content="Tooltip left" position="left">
            <span className="px-3 py-2 border-4 border-black text-sm font-semibold cursor-default">
              Left
            </span>
          </Tooltip>
          <Tooltip content="Tooltip right" position="right">
            <span className="px-3 py-2 border-4 border-black text-sm font-semibold cursor-default">
              Right
            </span>
          </Tooltip>
        </div>
      </Section>

      <Section title="With Icon Buttons">
        <div className="flex gap-4">
          <Tooltip content="Edit record">
            <IconButton icon={<Edit size={20} />} aria-label="Edit" />
          </Tooltip>
          <Tooltip content="Copy to clipboard">
            <IconButton icon={<Copy size={20} />} aria-label="Copy" />
          </Tooltip>
          <Tooltip content="Delete record">
            <IconButton icon={<Trash2 size={20} />} aria-label="Delete" variant="destructive" />
          </Tooltip>
          <Tooltip content="Settings">
            <IconButton icon={<Settings size={20} />} aria-label="Settings" />
          </Tooltip>
        </div>
      </Section>
    </div>
  );
}
