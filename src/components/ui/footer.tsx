import { type ReactNode } from "react";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

interface FooterProps {
  columns?: FooterColumn[];
  legal?: string;
  legalLinks?: { label: string; href: string }[];
  children?: ReactNode;
  className?: string;
}

function Footer({
  columns,
  legal,
  legalLinks,
  children,
  className = "",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={`border-t-4 border-black bg-white ${className}`}>
      {columns && columns.length > 0 && (
        <div className="px-6 pt-8 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-extrabold uppercase tracking-wider mb-3">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-text-muted hover:text-black hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {children}
      <div className="px-6 py-4 border-t-2 border-gray-light flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
        <span>{legal || `© ${year} Acme Corp. All rights reserved.`}</span>
        {legalLinks && (
          <div className="flex gap-4">
            {legalLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-black hover:underline">
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}

export { Footer, type FooterProps, type FooterColumn };
