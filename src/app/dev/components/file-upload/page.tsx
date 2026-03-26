"use client";

import { FileUpload } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function FileUploadShowcase() {
  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">File Upload</h1>
      <p className="text-text-muted mb-8">Drag-and-drop or click to select files. Validates type and size.</p>

      <Section title="Single File">
        <FileUpload label="Profile Photo" accept=".jpg,.png,.webp" maxSizeMB={5} />
      </Section>

      <Section title="Multi File">
        <FileUpload label="Attachments" multiple maxSizeMB={10} helperText="Upload supporting documents." />
      </Section>

      <Section title="Restricted Types">
        <FileUpload label="CSV Import" accept=".csv" maxSizeMB={25} helperText="Only CSV files accepted." />
      </Section>

      <Section title="Disabled">
        <FileUpload label="Uploads Paused" disabled />
      </Section>
    </div>
  );
}
