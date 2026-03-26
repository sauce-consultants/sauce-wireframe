"use client";

import { useState } from "react";
import { Button, Modal, Input } from "@/components/ui";

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

export default function ModalShowcase() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [destructiveOpen, setDestructiveOpen] = useState(false);

  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Modal</h1>
      <p className="text-text-muted mb-8">
        Focused overlay requiring attention or input. Blocks page interaction.
      </p>

      <Section title="Confirmation">
        <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
          Open Confirmation
        </Button>
        <Modal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="Publish Changes"
          footer={
            <>
              <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setConfirmOpen(false)}>
                Publish
              </Button>
            </>
          }
        >
          <p className="text-sm text-text-secondary">
            This will make your changes visible to all users. Are you sure you want to continue?
          </p>
        </Modal>
      </Section>

      <Section title="Form Modal">
        <Button variant="secondary" onClick={() => setFormOpen(true)}>
          Open Form
        </Button>
        <Modal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          title="Add Team Member"
          footer={
            <>
              <Button variant="ghost" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setFormOpen(false)}>
                Add Member
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input label="Full Name" placeholder="Jane Smith" />
            <Input label="Email" type="email" placeholder="jane@example.com" />
            <Input label="Role" placeholder="Developer" />
          </div>
        </Modal>
      </Section>

      <Section title="Destructive Confirmation">
        <Button variant="destructive" onClick={() => setDestructiveOpen(true)}>
          Delete Record
        </Button>
        <Modal
          open={destructiveOpen}
          onClose={() => setDestructiveOpen(false)}
          title="Delete Record"
          destructive
          footer={
            <>
              <Button variant="secondary" onClick={() => setDestructiveOpen(false)}>
                Keep Record
              </Button>
              <Button variant="destructive" onClick={() => setDestructiveOpen(false)}>
                Delete Record
              </Button>
            </>
          }
        >
          <p className="text-sm text-text-secondary">
            This action cannot be undone. The record and all associated data will be permanently removed.
          </p>
        </Modal>
      </Section>
    </div>
  );
}
