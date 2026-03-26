import { type ReactNode } from "react";

interface TopNavShellProps {
  nav: ReactNode;
  children: ReactNode;
}

function TopNavShell({ nav, children }: TopNavShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-sticky border-b-4 border-black bg-white">
        {nav}
      </header>
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}

export { TopNavShell };
