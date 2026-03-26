"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import type { MenuItem, MenuEntry } from "./dropdown-menu";

interface ContextMenuProps {
  children: ReactNode;
  items: MenuEntry[];
  className?: string;
}

function ContextMenu({ children, items, className = "" }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [highlighted, setHighlighted] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);

  const actionItems = items.filter((i): i is MenuItem => "id" in i && !("type" in i));

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, actionItems.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const item = actionItems[highlighted];
        if (item && !item.disabled) {
          item.onClick?.();
          setOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [open, highlighted, actionItems]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
    setHighlighted(0);
    setOpen(true);
  };

  let actionIndex = -1;

  return (
    <div className={className} onContextMenu={handleContextMenu}>
      {children}
      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="fixed z-command min-w-48 border-4 border-black bg-white shadow-md py-1"
          style={{ top: pos.y, left: pos.x }}
        >
          {items.map((entry, i) => {
            if ("type" in entry && entry.type === "separator") {
              return <div key={`sep-${i}`} role="separator" className="my-1 border-t-2 border-gray-light" />;
            }
            if ("type" in entry && entry.type === "label") {
              return (
                <div key={`lbl-${i}`} className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  {entry.label}
                </div>
              );
            }
            const item = entry as MenuItem;
            actionIndex++;
            const idx = actionIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={`
                  w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors
                  ${item.destructive ? "text-danger" : ""}
                  ${idx === highlighted ? "bg-gray-light" : "hover:bg-gray-light"}
                  ${item.disabled ? "opacity-50 pointer-events-none" : ""}
                `}
                onMouseEnter={() => setHighlighted(idx)}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.();
                    setOpen(false);
                  }
                }}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs font-mono text-text-muted">{item.shortcut}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { ContextMenu, type ContextMenuProps };
