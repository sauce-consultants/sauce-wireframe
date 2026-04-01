import Link from "next/link";

const sections = [
  {
    href: "/dev/brand",
    title: "Brand",
    description: "Colour palette, typography, icons, spacing, borders, and shadows",
  },
  {
    href: "/dev/components",
    title: "Components",
    description: "All UI components with variants, states, and props",
  },
  {
    href: "/dev/layouts",
    title: "Layouts",
    description: "App shell and content area patterns",
  },
  {
    href: "/dev/pages",
    title: "Pages",
    description: "Page templates with mock data and interactive flows",
  },
];

export default function DevIndex() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Dev Showcase</h1>
      <p className="text-text-muted mb-8">
        Living reference for the Sauce Kitchen component toolkit.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="block border-4 border-black p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-extrabold mb-1">{section.title}</h2>
            <p className="text-sm text-text-muted">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
