"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Modal, Textarea, Button } from "@/components/ui";
import { addDishComment } from "@/app/the-kitchen/actions";

interface AddCommentModalProps {
  open: boolean;
  onClose: () => void;
  dishId: number;
  onAdded: () => void;
}

export function AddCommentModal({ open, onClose, dishId, onAdded }: AddCommentModalProps) {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("dishId", String(dishId));
    formData.set("authorName", session?.user?.name || "Unknown");
    formData.set("authorType", "human");

    const result = await addDishComment(formData);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    form.reset();
    onAdded();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Comment" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Commenting as <span className="font-semibold text-black">{session?.user?.name || "..."}</span>
          </p>
          <Textarea
            label="Comment"
            name="content"
            placeholder="Write your comment... Markdown is supported."
            rows={4}
            required
          />
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
