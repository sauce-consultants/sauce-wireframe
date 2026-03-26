import { type ReactNode } from "react";

interface BottomNavItem {
  icon: ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

interface BottomNavShellProps {
  items: BottomNavItem[];
  header?: ReactNode;
  children: ReactNode;
  /** Use absolute positioning instead of fixed — for embedding in a demo container */
  contained?: boolean;
}

function BottomNavShell({ items, header, children, contained = false }: BottomNavShellProps) {
  const position = contained ? "absolute" : "fixed";

  return (
    <div className={`${contained ? "relative h-full" : "min-h-screen"} pb-16 lg:pb-0`}>
      {header && (
        <header className="border-b-4 border-black bg-white px-4 py-3">
          {header}
        </header>
      )}
      <main className="px-4 sm:px-6 py-4">
        {children}
      </main>
      <nav className={`${position} bottom-0 inset-x-0 z-sticky border-t-4 border-black bg-white pb-[env(safe-area-inset-bottom)] lg:hidden`}>
        <div className="flex justify-around items-center h-16">
          {items.map((item, i) => (
            <a
              key={`${item.href}-${i}`}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 text-xs font-semibold min-w-12 ${
                item.active ? "text-black" : "text-text-muted"
              }`}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}

export { BottomNavShell, type BottomNavItem };
