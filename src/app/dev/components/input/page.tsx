"use client";

import { Input } from "@/components/ui";
import { Mail, Search, Eye } from "lucide-react";

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

export default function InputShowcase() {
  return (
    <div className="w-full max-w-xl">
      <h1 className="text-4xl mb-2">Input</h1>
      <p className="text-text-muted mb-8">
        Single-line text entry field with label, validation, and adornments.
      </p>

      <Section title="Default">
        <div className="space-y-4">
          <Input label="Full Name" placeholder="Jane Smith" />
          <Input label="Email Address" type="email" placeholder="jane@example.com" required />
        </div>
      </Section>

      <Section title="Sizes">
        <div className="space-y-4">
          <Input label="Small" size="sm" placeholder="Small input" />
          <Input label="Medium" size="md" placeholder="Medium input" />
          <Input label="Large" size="lg" placeholder="Large input" />
        </div>
      </Section>

      <Section title="With Adornments">
        <div className="space-y-4">
          <Input
            label="Email"
            leadingAdornment={<Mail size={18} />}
            placeholder="jane@example.com"
          />
          <Input
            label="Search"
            leadingAdornment={<Search size={18} />}
            placeholder="Search records..."
          />
          <Input
            label="Password"
            type="password"
            trailingAdornment={<Eye size={18} />}
            placeholder="Enter password"
          />
        </div>
      </Section>

      <Section title="With Helper Text">
        <Input
          label="Username"
          placeholder="Choose a username"
          helperText="Must be 3-20 characters, letters and numbers only."
        />
      </Section>

      <Section title="States">
        <div className="space-y-4">
          <Input label="Default" placeholder="Default state" />
          <Input label="Disabled" placeholder="Cannot edit" disabled />
          <Input label="Read Only" value="Read-only value" readOnly />
          <Input label="Error" defaultValue="bad-email" error="Please enter a valid email address." />
          <Input label="Success" defaultValue="jane@example.com" success="Email is available." />
        </div>
      </Section>
    </div>
  );
}
