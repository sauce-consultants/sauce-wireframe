"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Badge, Button, Textarea, Markdown } from "@/components/ui";
import { Plus, User, Bot, Pencil } from "lucide-react";
import { AddCommentModal } from "./AddCommentModal";
import { editDishComment } from "@/app/the-kitchen/actions";
import type { DishComment } from "./types";
import { formatRelativeTime } from "@/lib/relative-time";

interface DishCommentsProps {
  comments: DishComment[];
  dishId: number;
  onRefresh: () => void;
}

export function DishComments({ comments, dishId, onRefresh }: DishCommentsProps) {
  const { data: session } = useSession();
  const [addOpen, setAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const currentUser = session?.user?.name;

  const startEdit = (comment: DishComment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
    setEditError(null);
  };

  const saveEdit = async () => {
    if (!editingId || !currentUser) return;
    setEditError(null);
    setSaving(true);

    const result = await editDishComment(editingId, editContent, currentUser);
    setSaving(false);

    if (result.error) {
      setEditError(result.error);
      return;
    }

    setEditingId(null);
    setEditContent("");
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-extrabold">Comments</h4>
        <Button size="sm" variant="secondary" leadingIcon={<Plus size={14} />} onClick={() => setAddOpen(true)}>
          Add Comment
        </Button>
      </div>

      {comments.length === 0 && (
        <div className="border-4 border-gray-light border-dashed p-6 text-center text-text-muted text-sm">
          No comments yet.
        </div>
      )}

      {comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => {
            const isOwn = currentUser === comment.authorName;
            const isEditing = editingId === comment.id;

            return (
              <div key={comment.id} className="border-4 border-black p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {comment.authorType === "human" ? (
                      <User size={14} className="text-text-muted" />
                    ) : (
                      <Bot size={14} className="text-text-muted" />
                    )}
                    <span className="text-xs font-semibold">{comment.authorName}</span>
                    <Badge variant="neutral">{comment.authorType}</Badge>
                    {comment.updatedAt && (
                      <span className="text-xs text-text-muted">(edited)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-text-muted">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                    {isOwn && !isEditing && (
                      <button
                        type="button"
                        onClick={() => startEdit(comment)}
                        className="text-text-muted hover:text-black transition-colors"
                        aria-label="Edit comment"
                      >
                        <Pencil size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <Textarea
                      label=""
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                    />
                    {editError && <p className="text-sm text-danger font-semibold">{editError}</p>}
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={saveEdit} loading={saving}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit} disabled={saving}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Markdown>{comment.content}</Markdown>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddCommentModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        dishId={dishId}
        onAdded={onRefresh}
      />
    </div>
  );
}
