"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { ArrowRight, Download, Plus, Trash2 } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function ButtonShowcase() {
  const [loading, setLoading] = useState(false);

  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Button</h1>
      <p className="text-text-muted mb-8">
        Clickable control that triggers an action. One primary per screen.
      </p>

      <Section title="Variants">
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link Style</Button>
        </div>
      </Section>

      <Section title="Sizes">
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="With Icons">
        <div className="flex flex-wrap gap-4 items-center">
          <Button leadingIcon={<Plus size={18} />}>Create Item</Button>
          <Button variant="secondary" trailingIcon={<ArrowRight size={18} />}>
            Continue
          </Button>
          <Button variant="secondary" leadingIcon={<Download size={18} />}>
            Download
          </Button>
          <Button variant="destructive" leadingIcon={<Trash2 size={18} />}>
            Delete Record
          </Button>
        </div>
      </Section>

      <Section title="States">
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button loading={loading} onClick={simulateLoad}>
            {loading ? "Saving..." : "Click to Load"}
          </Button>
        </div>
      </Section>

      <Section title="Full Width (Mobile Pattern)">
        <div className="max-w-sm space-y-3">
          <Button className="w-full">Save Changes</Button>
          <Button variant="secondary" className="w-full">Cancel</Button>
        </div>
      </Section>

      <Section title="Action Group">
        <div className="flex gap-3 justify-end border-4 border-gray-light p-4">
          <Button variant="ghost">Cancel</Button>
          <Button variant="destructive" leadingIcon={<Trash2 size={18} />}>
            Delete Record
          </Button>
          <Button>Save Changes</Button>
        </div>
      </Section>
    </div>
  );
}
