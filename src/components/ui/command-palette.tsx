"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { Search } from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  category?: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
}

function CommandPalette({
  open,
  onClose,
  items,
  placeholder = "Type a command...",
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  // Group by category
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    const cat = item.category || "Actions";
    (acc[cat] ??= []).push(item);
    return acc;
  }, {});

  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlighted(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && filtered[highlighted]) {
      filtered[highlighted].onSelect();
      onClose();
    }
  };

  if (!open) return null;

  let flatIndex = -1;

  return (
    <>
      <div className="fixed inset-0 z-backdrop bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 z-command w-full max-w-lg border-4 border-black bg-white shadow-lg overflow-hidden">
        <div className="flex items-center border-b-4 border-black px-4">
          <Search size={18} className="text-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={true}
            aria-autocomplete="list"
            aria-label="Command palette"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlighted(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-3 py-3 text-base outline-none bg-transparent placeholder:text-text-muted"
          />
        </div>

        <div className="max-h-80 overflow-y-auto py-2" role="listbox">
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-sm text-text-muted text-center">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <div key={category}>
              <div className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
                {category}
              </div>
              {categoryItems.map((item) => {
                flatIndex++;
                const idx = flatIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={idx === highlighted}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors
                      ${idx === highlighted ? "bg-gray-light" : "hover:bg-gray-light"}
                    `}
                    onMouseEnter={() => setHighlighted(idx)}
                    onClick={() => {
                      item.onSelect();
                      onClose();
                    }}
                  >
                    {item.icon && <span className="text-text-muted shrink-0">{item.icon}</span>}
                    <span className="flex-1 font-semibold">{item.label}</span>
                    {item.shortcut && (
                      <span className="text-xs font-mono text-text-muted bg-gray-light px-1.5 py-0.5 border-2 border-gray-light">
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="border-t-2 border-gray-light px-4 py-2 flex items-center gap-4 text-xs text-text-muted font-mono">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </>
  );
}

export { CommandPalette, type CommandPaletteProps, type CommandItem };
