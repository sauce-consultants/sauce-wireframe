"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function TextareaShowcase() {
  const [text, setText] = useState("");

  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Textarea</h1>
      <p className="text-text-muted mb-8">Multi-line text entry for descriptions, comments, and notes.</p>

      <Section title="Default">
        <Textarea label="Description" placeholder="Enter a description..." />
      </Section>

      <Section title="With Character Count">
        <Textarea
          label="Bio"
          placeholder="Tell us about yourself..."
          maxLength={200}
          currentLength={text.length}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Section>

      <Section title="States">
        <div className="space-y-4">
          <Textarea label="Default" placeholder="Default state" />
          <Textarea label="Disabled" placeholder="Cannot edit" disabled />
          <Textarea label="Error" error="Description is required." defaultValue="" />
          <Textarea label="With Helper" helperText="Markdown is supported." placeholder="Write something..." />
        </div>
      </Section>
    </div>
  );
}
