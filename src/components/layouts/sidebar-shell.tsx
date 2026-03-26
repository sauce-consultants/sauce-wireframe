"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { IconButton } from "../ui/icon-button";

interface SidebarShellProps {
  sidebar: ReactNode;
  header?: ReactNode;
  children: ReactNode;
}

function SidebarShell({ sidebar, header, children }: SidebarShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r-4 border-black overflow-y-auto shrink-0">
        {sidebar}
      </aside>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-backdrop bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-modal w-64 bg-white border-r-4 border-black flex flex-col transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end p-2">
          <IconButton
            icon={<X size={20} />}
            aria-label="Close menu"
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen(false)}
          />
        </div>
        {sidebar}
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b-4 border-black flex items-center gap-3 px-4 py-3 lg:px-6">
          <div className="lg:hidden">
            <IconButton
              icon={<Menu size={20} />}
              aria-label="Open menu"
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(true)}
            />
          </div>
          <div className="flex-1">{header}</div>
        </div>

        {/* Content region */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export { SidebarShell };
