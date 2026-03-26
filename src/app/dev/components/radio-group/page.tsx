"use client";

import { useState } from "react";
import { RadioGroup } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

const planOptions = [
  { value: "free", label: "Free", description: "Up to 3 projects" },
  { value: "pro", label: "Pro", description: "Unlimited projects, priority support" },
  { value: "enterprise", label: "Enterprise", description: "Custom limits, dedicated account manager" },
];

const sizeOptions = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

export default function RadioGroupShowcase() {
  const [plan, setPlan] = useState("pro");
  const [size, setSize] = useState("md");
  const [card, setCard] = useState("pro");

  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Radio Group</h1>
      <p className="text-text-muted mb-8">Mutually exclusive options. All visible for quick comparison.</p>

      <Section title="Stacked (Default)">
        <RadioGroup legend="Plan" name="plan" options={planOptions} value={plan} onChange={setPlan} />
      </Section>

      <Section title="Inline">
        <RadioGroup legend="Size" name="size" options={sizeOptions} value={size} onChange={setSize} variant="inline" />
      </Section>

      <Section title="Card Variant">
        <RadioGroup legend="Choose a Plan" name="card-plan" options={planOptions} value={card} onChange={setCard} variant="card" />
      </Section>

      <Section title="With Error">
        <RadioGroup
          legend="Priority"
          name="priority"
          options={[
            { value: "low", label: "Low" },
            { value: "med", label: "Medium" },
            { value: "high", label: "High" },
          ]}
          error="Please select a priority level."
        />
      </Section>
    </div>
  );
}
