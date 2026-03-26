"use client";

import { useState } from "react";
import { Slider } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function SliderShowcase() {
  const [volume, setVolume] = useState(60);
  const [price, setPrice] = useState(250);
  const [step, setStep] = useState(50);

  return (
    <div className="max-w-md">
      <h1 className="text-4xl mb-2">Slider</h1>
      <p className="text-text-muted mb-8">Numeric value selection along a continuous or stepped track.</p>

      <Section title="Default">
        <Slider label="Volume" value={volume} onChange={setVolume} valueSuffix="%" />
      </Section>

      <Section title="With Prefix">
        <Slider label="Max Price" min={0} max={1000} step={10} value={price} onChange={setPrice} valuePrefix="$" />
      </Section>

      <Section title="Stepped">
        <Slider label="Quantity" min={0} max={200} step={25} value={step} onChange={setStep} />
      </Section>

      <Section title="Disabled">
        <Slider label="Brightness" value={40} disabled valueSuffix="%" />
      </Section>
    </div>
  );
}
