"use client";

import { useState } from "react";
import { Button, Modal, Input } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function DeleteArchiveTemplate() {
  const [simpleOpen, setSimpleOpen] = useState(false);
  const [typedOpen, setTypedOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl mb-2">Delete / Archive Patterns</h1>
      <p className="text-text-muted mb-8">Confirmation flows for destructive actions. Not standalone pages.</p>

      <Section title="Pattern A: Simple Confirmation">
        <Button variant="destructive" onClick={() => setSimpleOpen(true)}>Delete Customer</Button>
        <Modal
          open={simpleOpen}
          onClose={() => setSimpleOpen(false)}
          title="Delete customer"
          destructive
          footer={
            <>
              <Button variant="secondary" onClick={() => setSimpleOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => setSimpleOpen(false)}>Delete Customer</Button>
            </>
          }
        >
          <p className="text-sm text-text-secondary mb-2">
            Are you sure you want to delete &quot;Acme Corp&quot;? This will permanently remove the customer and all associated data.
          </p>
          <p className="text-sm font-semibold">This action cannot be undone.</p>
        </Modal>
      </Section>

      <Section title="Pattern B: Typed Confirmation">
        <Button variant="destructive" onClick={() => setTypedOpen(true)}>Delete with Confirmation</Button>
        <Modal
          open={typedOpen}
          onClose={() => setTypedOpen(false)}
          title="Delete customer"
          destructive
          footer={
            <>
              <Button variant="secondary" onClick={() => setTypedOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => setTypedOpen(false)}>Delete Customer</Button>
            </>
          }
        >
          <p className="text-sm text-text-secondary mb-2">
            This will permanently delete &quot;Acme Corp&quot; and all 47 orders, 12 invoices, and 3 support tickets associated with it.
          </p>
          <div className="mt-4">
            <Input label='Type "Acme Corp" to confirm' placeholder="Acme Corp" />
          </div>
        </Modal>
      </Section>

      <Section title="Pattern C: Bulk Delete">
        <Button variant="destructive" onClick={() => setBulkOpen(true)}>Delete 5 Customers</Button>
        <Modal
          open={bulkOpen}
          onClose={() => setBulkOpen(false)}
          title="Delete 5 customers"
          destructive
          footer={
            <>
              <Button variant="secondary" onClick={() => setBulkOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => setBulkOpen(false)}>Delete 5 Customers</Button>
            </>
          }
        >
          <p className="text-sm text-text-secondary mb-3">
            Are you sure you want to delete these 5 customers? This will permanently remove them and all associated data.
          </p>
          <ul className="space-y-1 text-sm font-semibold">
            {["Acme Corp", "Beta Co", "Gamma Ltd", "Delta Inc", "Epsilon SA"].map((name) => (
              <li key={name}>&#8226; {name}</li>
            ))}
          </ul>
        </Modal>
      </Section>
    </div>
  );
}
