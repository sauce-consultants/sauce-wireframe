"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function CheckboxShowcase() {
  const [items, setItems] = useState({ a: true, b: false, c: true });
  const allChecked = items.a && items.b && items.c;
  const someChecked = items.a || items.b || items.c;

  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Checkbox</h1>
      <p className="text-text-muted mb-8">Toggle for binary choices or multi-select scenarios.</p>

      <Section title="Single">
        <Checkbox label="I agree to the terms and conditions" />
      </Section>

      <Section title="With Helper Text">
        <Checkbox label="Send me marketing emails" helperText="You can unsubscribe at any time." />
      </Section>

      <Section title="Group with Indeterminate">
        <div className="space-y-3">
          <Checkbox
            label="Select all"
            checked={allChecked}
            indeterminate={someChecked && !allChecked}
            onChange={() => {
              const next = !allChecked;
              setItems({ a: next, b: next, c: next });
            }}
          />
          <div className="ml-8 space-y-3">
            <Checkbox label="Item A" checked={items.a} onChange={() => setItems((s) => ({ ...s, a: !s.a }))} />
            <Checkbox label="Item B" checked={items.b} onChange={() => setItems((s) => ({ ...s, b: !s.b }))} />
            <Checkbox label="Item C" checked={items.c} onChange={() => setItems((s) => ({ ...s, c: !s.c }))} />
          </div>
        </div>
      </Section>

      <Section title="States">
        <div className="space-y-3">
          <Checkbox label="Default (unchecked)" />
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled checked" disabled defaultChecked />
        </div>
      </Section>
    </div>
  );
}
