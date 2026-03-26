"use client";

import { useState } from "react";
import { Select } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "In Review" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
  { value: "guest", label: "Guest", disabled: true },
];

export default function SelectShowcase() {
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");

  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Select</h1>
      <p className="text-text-muted mb-8">Dropdown for choosing a single value from a predefined list.</p>

      <Section title="Default">
        <Select label="Status" options={statusOptions} value={status} onChange={setStatus} />
      </Section>

      <Section title="With Disabled Option">
        <Select label="Role" options={roleOptions} value={role} onChange={setRole} helperText="Guest access is temporarily disabled." />
      </Section>

      <Section title="States">
        <div className="space-y-4">
          <Select label="Default" options={statusOptions} value="" onChange={() => {}} />
          <Select label="Disabled" options={statusOptions} value="draft" onChange={() => {}} disabled />
          <Select label="Error" options={statusOptions} value="" onChange={() => {}} error="Please select a status." required />
        </div>
      </Section>
    </div>
  );
}
