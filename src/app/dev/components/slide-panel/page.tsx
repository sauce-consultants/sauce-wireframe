"use client";

import { useState } from "react";
import { Button, SlidePanel, Input, Badge } from "@/components/ui";

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

export default function SlidePanelShowcase() {
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Slide Panel</h1>
      <p className="text-text-muted mb-8">
        Side-anchored overlay for detail views and forms. Slides from the edge.
      </p>

      <Section title="Detail View">
        <Button variant="secondary" onClick={() => setDetailOpen(true)}>
          View Record Details
        </Button>
        <SlidePanel
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          title="Order #1001"
        >
          <div className="space-y-6">
            <div>
              <p className="text-xs font-mono text-text-muted mb-1">Status</p>
              <Badge variant="success" dot>Delivered</Badge>
            </div>
            <div>
              <p className="text-xs font-mono text-text-muted mb-1">Customer</p>
              <p className="font-semibold">Jane Smith</p>
            </div>
            <div>
              <p className="text-xs font-mono text-text-muted mb-1">Total</p>
              <p className="font-mono font-bold text-2xl">$1,234.00</p>
            </div>
            <div>
              <p className="text-xs font-mono text-text-muted mb-1">Items</p>
              <div className="border-4 border-black divide-y-2 divide-gray-light">
                {["Widget A", "Widget B", "Widget C"].map((item) => (
                  <div key={item} className="px-4 py-3 flex justify-between">
                    <span className="text-sm">{item}</span>
                    <span className="text-sm font-mono">$411.33</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SlidePanel>
      </Section>

      <Section title="Form Panel">
        <Button variant="secondary" onClick={() => setFormOpen(true)}>
          Edit Record
        </Button>
        <SlidePanel
          open={formOpen}
          onClose={() => setFormOpen(false)}
          title="Edit Customer"
          footer={
            <>
              <Button variant="ghost" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setFormOpen(false)}>Save Changes</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input label="Full Name" defaultValue="Jane Smith" />
            <Input label="Email" type="email" defaultValue="jane@example.com" />
            <Input label="Phone" type="tel" defaultValue="+1 555 123 4567" />
            <Input label="Company" defaultValue="Acme Corp" />
          </div>
        </SlidePanel>
      </Section>
    </div>
  );
}
