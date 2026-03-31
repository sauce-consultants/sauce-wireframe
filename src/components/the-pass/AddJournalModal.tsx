"use client";

import { useState } from "react";
import { Modal, Textarea, Select, Button } from "@/components/ui";
import { OWNERS, ENTRY_TYPES } from "./types";
import { addJournalEntry } from "@/app/the-pass/actions";

interface AddJournalModalProps {
  open: boolean;
  onClose: () => void;
  customerId: number;
  onAdded: () => void;
}

const ownerOptions = Object.entries(OWNERS).map(([key, val]) => ({
  value: key,
  label: val.name,
}));

const typeOptions = ENTRY_TYPES.map((t) => ({
  value: t.value,
  label: t.label,
}));

export function AddJournalModal({ open, onClose, customerId, onAdded }: AddJournalModalProps) {
  const [author, setAuthor] = useState<string>("");
  const [entryType, setEntryType] = useState<string>("note");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("customerId", String(customerId));
    formData.set("author", author);
    formData.set("entryType", entryType);

    const result = await addJournalEntry(formData);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    form.reset();
    setAuthor("");
    setEntryType("note");
    onAdded();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Journal Entry" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Textarea
            label="What happened?"
            name="content"
            placeholder="Write your update here... Markdown is supported."
            rows={5}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select inline
              label="Author"
              options={ownerOptions}
              value={author}
              onChange={setAuthor}
              placeholder="Who's writing?"
              required
            />
            <Select inline
              label="Type"
              options={typeOptions}
              value={entryType}
              onChange={setEntryType}
            />
          </div>

          {error && (
            <p className="text-sm text-danger font-semibold">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t-4 border-black">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Add Entry
          </Button>
        </div>
      </form>
    </Modal>
  );
}
