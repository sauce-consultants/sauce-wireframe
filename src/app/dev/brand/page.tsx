import {
  ArrowRight,
  Check,
  ChevronDown,
  Edit,
  Home,
  Loader,
  Mail,
  Plus,
  Search,
  Settings,
  Trash2,
  User,
  X,
} from "lucide-react";

/* -----------------------------------------------------------------------
   Data
   ----------------------------------------------------------------------- */

const coreColours = [
  { name: "Black", token: "black", value: "#000000", className: "bg-black" },
  { name: "White", token: "white", value: "#FFFFFF", className: "bg-white border-2 border-black" },
  { name: "Gray Light", token: "gray-light", value: "#D4D4D4", className: "bg-gray-light" },
  { name: "Gray Mid", token: "gray-mid", value: "#737373", className: "bg-gray-mid" },
  { name: "Gray Dark", token: "gray-dark", value: "#404040", className: "bg-gray-dark" },
];

const semanticColours = [
  { name: "Accent", token: "accent", value: "#3B82F6", className: "bg-accent" },
  { name: "Danger", token: "danger", value: "#EF4444", className: "bg-danger" },
  { name: "Warning", token: "warning", value: "#EAB308", className: "bg-warning" },
  { name: "Success", token: "success", value: "#22C55E", className: "bg-success" },
];

const textColours = [
  { name: "Primary", token: "text-primary", value: "#000000", className: "bg-black" },
  { name: "Secondary", token: "text-secondary", value: "#404040", className: "bg-gray-dark" },
  { name: "Muted", token: "text-muted", value: "#737373", className: "bg-gray-mid" },
  { name: "Inverse", token: "text-inverse", value: "#FFFFFF", className: "bg-white border-2 border-black" },
];

const typeScale = [
  { name: "Display", class: "text-5xl", size: "3rem / 48px", weight: "900" },
  { name: "H1", class: "text-4xl", size: "2.25rem / 36px", weight: "900" },
  { name: "H2", class: "text-3xl", size: "1.875rem / 30px", weight: "900" },
  { name: "H3", class: "text-2xl", size: "1.5rem / 24px", weight: "900" },
  { name: "H4", class: "text-xl", size: "1.25rem / 20px", weight: "800" },
  { name: "H5", class: "text-lg", size: "1.125rem / 18px", weight: "800" },
  { name: "Body", class: "text-base", size: "1rem / 16px", weight: "400" },
  { name: "Body Semibold", class: "text-base font-semibold", size: "1rem / 16px", weight: "600" },
  { name: "Small", class: "text-sm", size: "0.875rem / 14px", weight: "400" },
  { name: "Caption", class: "text-xs", size: "0.75rem / 12px", weight: "400" },
];

const spacingScale = [
  { name: "1", value: "4px", class: "w-1" },
  { name: "2", value: "8px", class: "w-2" },
  { name: "3", value: "12px", class: "w-3" },
  { name: "4", value: "16px", class: "w-4" },
  { name: "6", value: "24px", class: "w-6" },
  { name: "8", value: "32px", class: "w-8" },
  { name: "12", value: "48px", class: "w-12" },
  { name: "16", value: "64px", class: "w-16" },
];

const icons = [
  { name: "Home", Icon: Home },
  { name: "Search", Icon: Search },
  { name: "Settings", Icon: Settings },
  { name: "User", Icon: User },
  { name: "Mail", Icon: Mail },
  { name: "Edit", Icon: Edit },
  { name: "Trash", Icon: Trash2 },
  { name: "Plus", Icon: Plus },
  { name: "X", Icon: X },
  { name: "Check", Icon: Check },
  { name: "ChevronDown", Icon: ChevronDown },
  { name: "ArrowRight", Icon: ArrowRight },
  { name: "Loader", Icon: Loader },
];

/* -----------------------------------------------------------------------
   Helpers
   ----------------------------------------------------------------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl mb-6 pb-2 border-b-4 border-black">{title}</h2>
      {children}
    </section>
  );
}

function ColourSwatch({
  name,
  token,
  value,
  className,
}: {
  name: string;
  token: string;
  value: string;
  className: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-20 w-full ${className}`} />
      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs font-mono text-text-muted">{token}</p>
        <p className="text-xs font-mono text-text-muted">{value}</p>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------
   Page
   ----------------------------------------------------------------------- */

export default function BrandPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl mb-2">Brand Reference</h1>
      <p className="text-text-muted mb-12">
        Visual identity tokens for Sauce Kitchen.
      </p>

      {/* --- Colours --- */}
      <Section title="Colour Palette">
        <h3 className="text-lg font-extrabold mb-4">Core</h3>
        <div className="grid grid-cols-5 gap-4 mb-8">
          {coreColours.map((c) => (
            <ColourSwatch key={c.token} {...c} />
          ))}
        </div>

        <h3 className="text-lg font-extrabold mb-4">Semantic</h3>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {semanticColours.map((c) => (
            <ColourSwatch key={c.token} {...c} />
          ))}
        </div>

        <h3 className="text-lg font-extrabold mb-4">Text</h3>
        <div className="grid grid-cols-4 gap-4">
          {textColours.map((c) => (
            <ColourSwatch key={c.token} {...c} />
          ))}
        </div>
      </Section>

      {/* --- Typography --- */}
      <Section title="Typography">
        <div className="mb-8">
          <h3 className="text-lg font-extrabold mb-4">Raleway — Headings &amp; Body</h3>
          <div className="space-y-4 border-4 border-black p-6">
            {typeScale.map((t) => (
              <div key={t.name} className="flex items-baseline gap-4">
                <span className="w-32 shrink-0 text-xs font-mono text-text-muted">
                  {t.name}
                </span>
                <span className={`${t.class} font-[${t.weight}] leading-heading`}>
                  The quick brown fox
                </span>
                <span className="shrink-0 text-xs font-mono text-text-muted ml-auto">
                  {t.size}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-extrabold mb-4">Space Mono — Numeric Data</h3>
          <div className="border-4 border-black p-6 space-y-3">
            <div className="flex items-baseline gap-4">
              <span className="w-32 shrink-0 text-xs font-mono text-text-muted">Regular</span>
              <span className="font-mono text-3xl">1,234,567.89</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-32 shrink-0 text-xs font-mono text-text-muted">Bold</span>
              <span className="font-mono font-bold text-3xl">$42,069.00</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-32 shrink-0 text-xs font-mono text-text-muted">Small</span>
              <span className="font-mono text-sm">REF-2024-00381</span>
            </div>
          </div>
        </div>
      </Section>

      {/* --- Icons --- */}
      <Section title="Icons">
        <p className="text-sm text-text-muted mb-4">
          Lucide React — 24px default, <code className="font-mono">currentColor</code>
        </p>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-4">
          {icons.map(({ name, Icon }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-2 border-2 border-gray-light p-3"
            >
              <Icon size={24} />
              <span className="text-xs font-mono text-text-muted">{name}</span>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="text-sm font-semibold mb-2">Sizes</p>
          <div className="flex items-end gap-6">
            <div className="flex flex-col items-center gap-1">
              <Home size={16} />
              <span className="text-xs font-mono text-text-muted">16</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Home size={20} />
              <span className="text-xs font-mono text-text-muted">20</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Home size={24} />
              <span className="text-xs font-mono text-text-muted">24</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Home size={32} />
              <span className="text-xs font-mono text-text-muted">32</span>
            </div>
          </div>
        </div>
      </Section>

      {/* --- Spacing --- */}
      <Section title="Spacing">
        <div className="space-y-3">
          {spacingScale.map((s) => (
            <div key={s.name} className="flex items-center gap-4">
              <span className="w-12 shrink-0 text-xs font-mono text-text-muted text-right">
                {s.value}
              </span>
              <div className={`h-4 bg-black ${s.class}`} />
              <span className="text-xs font-mono text-text-muted">{s.name}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* --- Borders --- */}
      <Section title="Borders">
        <div className="flex gap-8 mb-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 border-4 border-black" />
            <span className="text-xs font-mono text-text-muted">4px default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 border-8 border-black" />
            <span className="text-xs font-mono text-text-muted">8px heavy</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 border-2 border-gray-light" />
            <span className="text-xs font-mono text-text-muted">2px muted</span>
          </div>
        </div>
        <p className="text-sm font-semibold mb-2">Border radius: 0 (square edges everywhere)</p>
      </Section>

      {/* --- Shadows --- */}
      <Section title="Shadows">
        <p className="text-sm text-text-muted mb-6">
          Offset solid borders in mid-gray — not box-shadow blur.
        </p>
        <div className="flex gap-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 border-4 border-black shadow-sm" />
            <span className="text-xs font-mono text-text-muted">shadow-sm</span>
            <span className="text-xs font-mono text-text-muted">2px offset</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 border-4 border-black shadow-md" />
            <span className="text-xs font-mono text-text-muted">shadow-md</span>
            <span className="text-xs font-mono text-text-muted">4px offset</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 border-4 border-black shadow-lg" />
            <span className="text-xs font-mono text-text-muted">shadow-lg</span>
            <span className="text-xs font-mono text-text-muted">8px offset</span>
          </div>
        </div>
      </Section>

      {/* --- Z-Index --- */}
      <Section title="Z-Index Scale">
        <div className="border-4 border-black p-6">
          <div className="space-y-2 font-mono text-sm">
            {[
              { name: "base", value: "0" },
              { name: "sticky", value: "10" },
              { name: "dropdown", value: "20" },
              { name: "overlay", value: "30" },
              { name: "backdrop", value: "40" },
              { name: "modal", value: "50" },
              { name: "toast", value: "60" },
              { name: "command", value: "70" },
            ].map((z) => (
              <div key={z.name} className="flex justify-between">
                <span className="text-text-muted">--z-{z.name}</span>
                <span className="font-bold">{z.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
