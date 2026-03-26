import Link from "next/link";

const templates = [
  { name: "Dashboard", slug: "dashboard", description: "Landing page with stat cards, widget grid, and activity feed." },
  { name: "Resource List", slug: "resource-list", description: "Table page with search, filters, sorting, pagination, and bulk actions." },
  { name: "Resource Create", slug: "resource-create", description: "Sectioned form for creating a new resource." },
  { name: "Resource Detail", slug: "resource-detail", description: "Main + aside layout showing a single resource in full." },
  { name: "Resource Edit", slug: "resource-edit", description: "Pre-populated form for editing an existing resource." },
  { name: "Delete / Archive", slug: "delete-archive", description: "Confirmation modal patterns for destructive actions." },
  { name: "HasMany List", slug: "hasmany-list", description: "Scoped list page for a parent resource's children." },
];

export default function PagesIndex() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Page Templates</h1>
      <p className="text-text-muted mb-8">
        7 standard admin/CRUD page types composed from layouts and components.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map((t) => (
          <Link
            key={t.slug}
            href={`/dev/pages/${t.slug}`}
            className="block border-4 border-black p-5 hover:shadow-md transition-shadow"
          >
            <h2 className="font-extrabold mb-1">{t.name}</h2>
            <p className="text-sm text-text-muted">{t.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
