"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { Portal } from "./portal";
import { useFloating } from "./use-floating";

interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  destructive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

type MenuEntry = MenuItem | { type: "separator" } | { type: "label"; label: string };

interface DropdownMenuProps {
  trigger: ReactNode;
  items: MenuEntry[];
  align?: "start" | "end";
  className?: string;
}

function DropdownMenu({
  trigger,
  items,
  align = "start",
  className = "",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const { triggerRef, pos } = useFloating(open);
  const menuRef = useRef<HTMLDivElement>(null);

  const actionItems = items.filter((i): i is MenuItem => "id" in i && !("type" in i));

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, triggerRef]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault();
      setOpen(true);
      setHighlighted(0);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, actionItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const item = actionItems[highlighted];
      if (item && !item.disabled) {
        item.onClick?.();
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  let actionIndex = -1;

  return (
    <div className={`inline-block ${className}`} ref={triggerRef}>
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
      >
        {trigger}
      </div>

      {open && pos && (
        <Portal>
          <div
            ref={menuRef}
            role="menu"
            className="absolute z-dropdown min-w-48 border-4 border-black bg-white shadow-md py-1"
            style={{
              top: pos.top + 4,
              left: align === "end" ? undefined : pos.left,
              right: align === "end" ? document.documentElement.clientWidth - pos.left - pos.width : undefined,
            }}
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
        </Portal>
      )}
    </div>
  );
}

export { DropdownMenu, type DropdownMenuProps, type MenuItem, type MenuEntry };
