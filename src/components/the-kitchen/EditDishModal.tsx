"use client";

import { useState, useEffect } from "react";
import { Modal, Input, Textarea, Select, Button } from "@/components/ui";
import { OWNERS, T_SHIRT_SIZES } from "@/components/the-pass/types";
import { DISH_STATUSES, PRIORITIES, AGENT_SUGGESTIONS, type Dish, type ProjectOption } from "./types";
import { updateDish } from "@/app/the-kitchen/actions";

interface EditDishModalProps {
  open: boolean;
  onClose: () => void;
  dish: Dish;
  projects: ProjectOption[];
}

const statusOptions = DISH_STATUSES.map((s) => ({ value: s.key, label: s.title }));
const priorityOptions = PRIORITIES.map((p) => ({ value: p.value, label: p.label }));
const ownerOptions = Object.entries(OWNERS).map(([key, val]) => ({ value: key, label: val.name }));
const sizeOptions = T_SHIRT_SIZES.map((s) => ({ value: s.value, label: s.label }));

export function EditDishModal({ open, onClose, dish, projects }: EditDishModalProps) {
  const [status, setStatus] = useState<string>(dish.status);
  const [customerId, setCustomerId] = useState<string>(String(dish.customerId));
  const [assignee, setAssignee] = useState<string>(dish.assignee ?? "");
  const [priority, setPriority] = useState<string>(dish.priority);
  const [size, setSize] = useState<string>(dish.size ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const projectOptions = projects.map((p) => ({
    value: String(p.id),
    label: `${p.name}${p.subtitle ? ` — ${p.subtitle}` : ""}`,
  }));

  useEffect(() => {
    setStatus(dish.status);
    setCustomerId(String(dish.customerId));
    setAssignee(dish.assignee ?? "");
    setPriority(dish.priority);
    setSize(dish.size ?? "");
    setError(null);
  }, [dish]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("id", String(dish.id));
    formData.set("status", status);
    formData.set("customerId", customerId);
    formData.set("assignee", assignee);
    formData.set("priority", priority);
    formData.set("size", size);

    const result = await updateDish(formData);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Dish" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input label="Title" name="title" defaultValue={dish.title} required />
          <Select inline label="Project" options={projectOptions} value={customerId} onChange={setCustomerId} required />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select inline label="Status" options={statusOptions} value={status} onChange={setStatus} />
            <Select inline label="Priority" options={priorityOptions} value={priority} onChange={setPriority} />
            <Select inline label="Size" options={sizeOptions} value={size} onChange={setSize} placeholder="—" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select inline label="Assignee" options={ownerOptions} value={assignee} onChange={setAssignee} placeholder="Unassigned" />
            <Input label="Agent" name="agent" defaultValue={dish.agent ?? ""} placeholder={`e.g. ${AGENT_SUGGESTIONS[0]}`} />
          </div>
          <Input label="Labels" name="labels" defaultValue={dish.labels.join(", ")} placeholder="e.g. bug, frontend" />
          <Textarea label="Description" name="body" defaultValue={dish.body} rows={6} />
          {error && <p className="text-sm text-danger font-semibold">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t-4 border-black">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" loading={submitting}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}
