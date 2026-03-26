import { Footer } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function FooterShowcase() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Footer</h1>
      <p className="text-text-muted mb-8">Page-level area for secondary navigation, legal links, and metadata.</p>

      <Section title="Simple">
        <div className="border-4 border-black overflow-hidden">
          <Footer
            legal="© 2026 Acme Corp. All rights reserved."
            legalLinks={[
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
            ]}
          />
        </div>
      </Section>

      <Section title="Multi-Column">
        <div className="border-4 border-black overflow-hidden">
          <Footer
            columns={[
              { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }, { label: "Changelog", href: "#" }] },
              { title: "Company", links: [{ label: "About", href: "#" }, { label: "Blog", href: "#" }, { label: "Careers", href: "#" }] },
              { title: "Support", links: [{ label: "Help Centre", href: "#" }, { label: "Contact", href: "#" }, { label: "Status", href: "#" }] },
              { title: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }, { label: "Cookies", href: "#" }] },
            ]}
            legalLinks={[
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Service", href: "#" },
            ]}
          />
        </div>
      </Section>
    </div>
  );
}
