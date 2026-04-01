"use client";

import { useState, useEffect } from "react";
import { Modal, Input, Select, Button } from "@/components/ui";
import { STAGES, T_SHIRT_SIZES, type Customer } from "./types";
import { updateCustomer } from "@/app/the-pass/actions";

interface EditCustomerModalProps {
  open: boolean;
  onClose: () => void;
  customer: Customer;
  users: { id: number; name: string }[];
}

const stageOptions = STAGES.map((s) => ({
  value: s.key,
  label: `${s.title} (${s.key})`,
}));

const sizeOptions = T_SHIRT_SIZES.map((s) => ({
  value: s.value,
  label: s.label,
}));

export function EditCustomerModal({ open, onClose, customer, users }: EditCustomerModalProps) {
  const ownerOptions = users.map((u) => ({ value: u.name, label: u.name }));
  const [stage, setStage] = useState<string>(customer.stage);
  const [owner, setOwner] = useState<string>(customer.owner);
  const [size, setSize] = useState<string>(customer.size ?? "M");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setStage(customer.stage);
    setOwner(customer.owner);
    setSize(customer.size ?? "M");
    setError(null);
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("id", String(customer.id));
    formData.set("stage", stage);
    formData.set("owner", owner);
    formData.set("size", size);

    const result = await updateCustomer(formData);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Customer" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Company Name"
            name="companyName"
            defaultValue={customer.companyName}
            required
          />
          <Input
            label="Subtitle"
            name="subtitle"
            defaultValue={customer.subtitle ?? ""}
            placeholder="e.g. York site, Phase 2"
            helperText="Optional project or site name."
          />
          <Input
            label="Project Code"
            name="shortCode"
            defaultValue={customer.shortCode ?? ""}
            placeholder="e.g. ACME"
            helperText="Unique short code used in dish references."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Stage" options={stageOptions} value={stage} onChange={setStage} required />
            <Select label="Owner" options={ownerOptions} value={owner} onChange={setOwner} required />
            <Select label="Size" options={sizeOptions} value={size} onChange={setSize} />
          </div>
          <Input
            label="Next Action"
            name="nextAction"
            defaultValue={customer.nextAction ?? ""}
            placeholder="e.g. Send intro email"
          />
          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            defaultValue={customer.dueDate ?? ""}
          />

          {error && (
            <p className="text-sm text-danger font-semibold">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t-4 border-black">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
