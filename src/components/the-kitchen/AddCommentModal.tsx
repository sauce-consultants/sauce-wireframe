"use client";

import { useState } from "react";
import { Modal, Textarea, Input, Select, Button } from "@/components/ui";
import { OWNERS } from "@/components/the-pass/types";
import { addDishComment } from "@/app/the-kitchen/actions";

interface AddCommentModalProps {
  open: boolean;
  onClose: () => void;
  dishId: number;
  onAdded: () => void;
}

const ownerOptions = Object.entries(OWNERS).map(([key, val]) => ({
  value: val.name,
  label: val.name,
}));

export function AddCommentModal({ open, onClose, dishId, onAdded }: AddCommentModalProps) {
  const [authorType, setAuthorType] = useState<"human" | "agent">("human");
  const [humanAuthor, setHumanAuthor] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("dishId", String(dishId));
    formData.set("authorType", authorType);

    if (authorType === "human") {
      formData.set("authorName", humanAuthor);
    }
    // For agent, authorName comes from the input field via name="authorName"

    const result = await addDishComment(formData);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    form.reset();
    setHumanAuthor("");
    setAuthorType("human");
    onAdded();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Comment" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Textarea
            label="Comment"
            name="content"
            placeholder="Write your comment... Markdown is supported."
            rows={4}
            required
          />

          {/* Author type toggle */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Author Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAuthorType("human")}
                className={`px-4 py-2 text-sm font-semibold border-4 transition-colors ${
                  authorType === "human" ? "border-black bg-black text-white" : "border-gray-light text-text-muted"
                }`}
              >
                Human
              </button>
              <button
                type="button"
                onClick={() => setAuthorType("agent")}
                className={`px-4 py-2 text-sm font-semibold border-4 transition-colors ${
                  authorType === "agent" ? "border-black bg-black text-white" : "border-gray-light text-text-muted"
                }`}
              >
                Agent
              </button>
            </div>
          </div>

          {authorType === "human" ? (
            <Select
              inline
              label="Author"
              options={ownerOptions}
              value={humanAuthor}
              onChange={setHumanAuthor}
              placeholder="Select person"
              required
            />
          ) : (
            <Input
              label="Agent Name"
              name="authorName"
              placeholder="e.g. ux-designer, backend-dev"
              required
            />
          )}

          {error && <p className="text-sm text-danger font-semibold">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t-4 border-black">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" loading={submitting}>Add Comment</Button>
        </div>
      </form>
    </Modal>
  );
}
