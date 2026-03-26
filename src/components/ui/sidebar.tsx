"use client";

import { type ReactNode } from "react";

interface SidebarItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
  children?: { label: string; href: string; active?: boolean }[];
}

interface SidebarProps {
  items: SidebarItem[];
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

function Sidebar({ items, header, footer, className = "" }: SidebarProps) {
  return (
    <aside className={`w-64 border-r-4 border-black bg-white flex flex-col ${className}`}>
      {header && <div className="px-4 py-4 border-b-4 border-black shrink-0">{header}</div>}
      <nav aria-label="Sidebar navigation" className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors ${
                  item.active
                    ? "bg-black text-white"
                    : "text-text-secondary hover:bg-gray-light"
                }`}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                {item.label}
              </a>
              {item.children && item.children.length > 0 && (
                <ul className="ml-8 mt-0.5 flex flex-col gap-0.5">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <a
                        href={child.href}
                        aria-current={child.active ? "page" : undefined}
                        className={`block px-3 py-1.5 text-sm transition-colors ${
                          child.active
                            ? "font-semibold text-black"
                            : "text-text-muted hover:text-black"
                        }`}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      {footer && <div className="px-4 py-3 border-t-4 border-black shrink-0">{footer}</div>}
    </aside>
  );
}

export { Sidebar, type SidebarProps, type SidebarItem };
