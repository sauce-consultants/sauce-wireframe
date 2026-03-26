"use client";

import { useState } from "react";
import { Combobox } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

const countryOptions = [
  { value: "au", label: "Australia" },
  { value: "ca", label: "Canada" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "nz", label: "New Zealand" },
  { value: "uk", label: "United Kingdom" },
  { value: "us", label: "United States" },
];

const techOptions = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "next", label: "Next.js" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

export default function ComboboxShowcase() {
  const [country, setCountry] = useState("");
  const [techs, setTechs] = useState<string[]>(["react", "next"]);

  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Combobox</h1>
      <p className="text-text-muted mb-8">Searchable select for large option sets. Supports single and multi-select.</p>

      <Section title="Single Select">
        <Combobox
          label="Country"
          options={countryOptions}
          value={country}
          onChange={(v) => setCountry(v as string)}
          placeholder="Search countries..."
        />
      </Section>

      <Section title="Multi Select">
        <Combobox
          label="Tech Stack"
          options={techOptions}
          value={techs}
          onChange={(v) => setTechs(v as string[])}
          placeholder="Add frameworks..."
          multiple
        />
      </Section>

      <Section title="States">
        <div className="space-y-4">
          <Combobox label="Default" options={countryOptions} placeholder="Search..." />
          <Combobox label="Disabled" options={countryOptions} disabled placeholder="Cannot edit" />
          <Combobox label="Error" options={countryOptions} error="Please select a country." required />
        </div>
      </Section>
    </div>
  );
}
