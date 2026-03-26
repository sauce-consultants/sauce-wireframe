"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { IconButton } from "./icon-button";

interface HeaderProps {
  logo: ReactNode;
  navItems?: { label: string; href: string; active?: boolean }[];
  actions?: ReactNode;
  className?: string;
}

function Header({ logo, navItems = [], actions, className = "" }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={`border-b-4 border-black bg-white ${className}`}>
      <div className="flex items-center justify-between h-16 px-6">
        <div className="shrink-0">{logo}</div>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                item.active
                  ? "bg-black text-white"
                  : "text-text-secondary hover:bg-gray-light"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {actions}
          <div className="lg:hidden">
            <IconButton
              icon={mobileOpen ? <X size={20} /> : <Menu size={20} />}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(!mobileOpen)}
            />
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav aria-label="Mobile navigation" className="lg:hidden border-t-4 border-black px-4 py-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`block px-3 py-3 text-sm font-semibold ${
                item.active ? "bg-black text-white" : "hover:bg-gray-light"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

export { Header, type HeaderProps };
