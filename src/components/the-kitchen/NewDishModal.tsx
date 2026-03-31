"use client";

import { useState } from "react";
import { Modal, Input, Textarea, Select, Button } from "@/components/ui";
import { T_SHIRT_SIZES } from "@/components/the-pass/types";
import { DISH_STATUSES, PRIORITIES, AGENT_SUGGESTIONS, type ProjectOption } from "./types";
import { createDish } from "@/app/the-kitchen/actions";

interface NewDishModalProps {
  open: boolean;
  onClose: () => void;
  projects: ProjectOption[];
  users: { id: number; name: string }[];
}

const statusOptions = DISH_STATUSES.map((s) => ({ value: s.key, label: s.title }));
const priorityOptions = PRIORITIES.map((p) => ({ value: p.value, label: p.label }));
const sizeOptions = T_SHIRT_SIZES.map((s) => ({ value: s.value, label: s.label }));

export function NewDishModal({ open, onClose, projects, users }: NewDishModalProps) {
  const ownerOptions = users.map((u) => ({ value: u.name, label: u.name }));
  const [status, setStatus] = useState<string>("backlog");
  const [customerId, setCustomerId] = useState<string>("");
  const [assignee, setAssignee] = useState<string>("");
  const [priority, setPriority] = useState<string>("med");
  const [size, setSize] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const projectOptions = projects.map((p) => ({
    value: String(p.id),
    label: `${p.name}${p.subtitle ? ` — ${p.subtitle}` : ""}`,
  }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("status", status);
    formData.set("customerId", customerId);
    formData.set("assignee", assignee);
    formData.set("priority", priority);
    formData.set("size", size);

    const result = await createDish(formData);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    form.reset();
    setStatus("backlog");
    setCustomerId("");
    setAssignee("");
    setPriority("med");
    setSize("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Dish" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input label="Title" name="title" placeholder="e.g. Build login page" required />
          <Select inline label="Project" options={projectOptions} value={customerId} onChange={setCustomerId} placeholder="Select table" required />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select inline label="Status" options={statusOptions} value={status} onChange={setStatus} />
            <Select inline label="Priority" options={priorityOptions} value={priority} onChange={setPriority} />
            <Select inline label="Size" options={sizeOptions} value={size} onChange={setSize} placeholder="—" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select inline label="Assignee" options={ownerOptions} value={assignee} onChange={setAssignee} placeholder="Unassigned" />
            <Input label="Agent" name="agent" placeholder={`e.g. ${AGENT_SUGGESTIONS[0]}`} helperText="AI agent working on this." />
          </div>
          <Input label="Labels" name="labels" placeholder="e.g. bug, frontend, spike" helperText="Comma-separated." />
          <Textarea label="Description" name="body" placeholder="Markdown content..." rows={4} />
          {error && <p className="text-sm text-danger font-semibold">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t-4 border-black">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" loading={submitting}>Add Dish</Button>
        </div>
      </form>
    </Modal>
  );
}
