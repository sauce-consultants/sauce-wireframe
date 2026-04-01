"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/dev", label: "Overview" },
  { href: "/dev/brand", label: "Brand" },
  { href: "/dev/components", label: "Components" },
  { href: "/dev/layouts", label: "Layouts" },
  { href: "/dev/pages", label: "Pages" },
];

function NavLinks({ pathname, onClick }: { pathname: string; onClick?: () => void }) {
  return (
    <>
      {navItems.map((item) => {
        const isActive =
          item.href === "/dev"
            ? pathname === "/dev"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={`px-3 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-black text-white"
                : "text-text-secondary hover:bg-gray-light"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export default function DevLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b-4 border-black px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/dev" className="text-xl font-black tracking-tight">
            Sauce Kitchen
          </Link>
        </div>
        <span className="text-xs font-mono text-text-muted border-2 border-gray-mid px-2 py-0.5">
          DEV
        </span>
      </header>

      <div className="flex flex-1 relative">
        {/* Desktop sidebar */}
        <nav className="hidden lg:flex w-56 border-r-4 border-black p-4 flex-col gap-1 shrink-0">
          <NavLinks pathname={pathname} />
        </nav>

        {/* Mobile drawer backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-backdrop bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile drawer */}
        <nav
          className={`fixed inset-y-0 left-0 z-modal w-56 bg-white border-r-4 border-black p-4 flex flex-col gap-1 transition-transform lg:hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <NavLinks pathname={pathname} onClick={() => setMobileOpen(false)} />
        </nav>

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
