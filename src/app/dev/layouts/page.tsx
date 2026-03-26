import Link from "next/link";

const shells = [
  { name: "Sidebar Shell", slug: "sidebar-shell", description: "Fixed sidebar + scrolling content. Standard admin/SaaS pattern." },
  { name: "Top Nav Shell", slug: "topnav-shell", description: "Sticky horizontal nav. For shallow navigation (5-8 items)." },
  { name: "Bottom Nav Shell", slug: "bottomnav-shell", description: "Mobile-native bottom navigation with fixed tab bar." },
];

const contentLayouts = [
  { name: "Single Column", slug: "single-column", description: "Width-constrained content for forms, settings, and prose." },
  { name: "Dashboard Grid", slug: "dashboard-grid", description: "Stat row + widget grid for operational dashboards." },
  { name: "Split View", slug: "split-view", description: "Master-detail side by side. List + detail panel." },
  { name: "Main + Aside", slug: "main-aside", description: "Primary content with a supporting sidebar panel." },
  { name: "Centered Card", slug: "centered-card", description: "Auth screens and single-action pages." },
];

function LayoutCard({ slug, name, description }: { slug: string; name: string; description: string }) {
  return (
    <Link
      href={`/dev/layouts/${slug}`}
      className="block border-4 border-black p-5 hover:shadow-md transition-shadow"
    >
      <h3 className="font-extrabold mb-1">{name}</h3>
      <p className="text-sm text-text-muted">{description}</p>
    </Link>
  );
}

export default function LayoutsIndex() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Layouts</h1>
      <p className="text-text-muted mb-10">
        Shells wrap the entire page. Content layouts compose inside a shell&apos;s main region.
      </p>

      <h2 className="text-2xl font-extrabold mb-4 pb-2 border-b-4 border-black">Shells</h2>
      <p className="text-sm text-text-muted mb-4">
        Full-page wrappers that handle navigation chrome, scrolling strategy, and responsive breakpoints.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {shells.map((s) => (
          <LayoutCard key={s.slug} {...s} />
        ))}
      </div>

      <h2 className="text-2xl font-extrabold mb-4 pb-2 border-b-4 border-black">Content Layouts</h2>
      <p className="text-sm text-text-muted mb-4">
        Arrangements for the content region inside a shell. Control width, columns, and panel structure.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contentLayouts.map((l) => (
          <LayoutCard key={l.slug} {...l} />
        ))}
      </div>
    </div>
  );
}
