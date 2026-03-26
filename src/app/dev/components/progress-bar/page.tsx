"use client";

import { useState, useEffect } from "react";
import { ProgressBar } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

function AnimatedProgress() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 5));
    }, 300);
    return () => clearInterval(interval);
  }, []);
  return <ProgressBar label="Uploading files..." value={value} />;
}

export default function ProgressBarShowcase() {
  return (
    <div className="max-w-md">
      <h1 className="text-4xl mb-2">Progress Bar</h1>
      <p className="text-text-muted mb-8">Visual progress toward completion. Determinate or indeterminate.</p>

      <Section title="Static Values">
        <div className="space-y-6">
          <ProgressBar label="Storage used" value={35} />
          <ProgressBar label="Upload complete" value={100} variant="success" />
          <ProgressBar label="Sync failed" value={60} variant="error" />
        </div>
      </Section>

      <Section title="Animated">
        <AnimatedProgress />
      </Section>

      <Section title="Indeterminate">
        <ProgressBar label="Processing..." indeterminate />
      </Section>

      <Section title="No Label">
        <ProgressBar value={72} />
      </Section>
    </div>
  );
}
