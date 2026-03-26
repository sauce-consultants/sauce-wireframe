import Link from "next/link";

const categories = [
  {
    name: "Core Inputs",
    components: [
      { name: "Button", slug: "button", ready: true },
      { name: "Icon Button", slug: "icon-button", ready: true },
      { name: "Input", slug: "input", ready: true },
      { name: "Textarea", slug: "textarea", ready: true },
      { name: "Select", slug: "select", ready: true },
      { name: "Combobox", slug: "combobox", ready: true },
      { name: "Checkbox", slug: "checkbox", ready: true },
      { name: "Radio Group", slug: "radio-group", ready: true },
      { name: "Toggle", slug: "toggle", ready: true },
      { name: "Slider", slug: "slider", ready: true },
      { name: "Date Picker", slug: "date-picker", ready: true },
      { name: "File Upload", slug: "file-upload", ready: true },
    ],
  },
  {
    name: "Data Display",
    components: [
      { name: "Badge", slug: "badge", ready: true },
      { name: "Table", slug: "table", ready: true },
      { name: "Card", slug: "card", ready: true },
      { name: "Accordion", slug: "accordion", ready: true },
      { name: "Avatar", slug: "avatar", ready: true },
      { name: "Tooltip", slug: "tooltip", ready: true },
      { name: "Stat Card", slug: "stat-card", ready: true },
      { name: "Timeline", slug: "timeline", ready: true },
      { name: "Empty State", slug: "empty-state", ready: true },
    ],
  },
  {
    name: "Feedback & Overlays",
    components: [
      { name: "Spinner", slug: "spinner", ready: true },
      { name: "Skeleton", slug: "skeleton", ready: true },
      { name: "Modal", slug: "modal", ready: true },
      { name: "Slide Panel", slug: "slide-panel", ready: true },
      { name: "Toast", slug: "toast", ready: true },
      { name: "Alert", slug: "alert", ready: true },
      { name: "Progress Bar", slug: "progress-bar", ready: true },
    ],
  },
  {
    name: "Layout & Navigation",
    components: [
      { name: "Header", slug: "header", ready: true },
      { name: "Sidebar", slug: "sidebar", ready: true },
      { name: "Breadcrumbs", slug: "breadcrumbs", ready: true },
      { name: "Tabs", slug: "tabs", ready: true },
      { name: "Pagination", slug: "pagination", ready: true },
      { name: "Stepper", slug: "stepper", ready: true },
      { name: "Footer", slug: "footer", ready: true },
    ],
  },
  {
    name: "Composite Patterns",
    components: [
      { name: "Command Palette", slug: "command-palette", ready: true },
      { name: "Dropdown Menu", slug: "dropdown-menu", ready: true },
      { name: "Context Menu", slug: "context-menu", ready: true },
      { name: "Form", slug: "form", ready: true },
      { name: "Search", slug: "search", ready: true },
    ],
  },
];

export default function ComponentsIndex() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Components</h1>
      <p className="text-text-muted mb-8">41 components across 5 categories.</p>
      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat.name}>
            <h2 className="text-xl font-extrabold mb-3 pb-1 border-b-2 border-gray-light">
              {cat.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {cat.components.map((c) =>
                c.ready ? (
                  <Link
                    key={c.slug}
                    href={`/dev/components/${c.slug}`}
                    className="px-3 py-2 border-4 border-black text-sm font-semibold hover:shadow-md transition-shadow"
                  >
                    {c.name}
                  </Link>
                ) : (
                  <div
                    key={c.slug}
                    className="px-3 py-2 border-2 border-gray-light text-sm text-text-muted"
                  >
                    {c.name}
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
