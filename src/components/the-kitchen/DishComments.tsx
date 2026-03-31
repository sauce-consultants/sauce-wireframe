"use client";

import { useState } from "react";
import { Badge, Button, Markdown } from "@/components/ui";
import { Plus, User, Bot } from "lucide-react";
import { AddCommentModal } from "./AddCommentModal";
import type { DishComment } from "./types";
import { formatRelativeTime } from "@/lib/relative-time";

interface DishCommentsProps {
  comments: DishComment[];
  dishId: number;
  onRefresh: () => void;
}

export function DishComments({ comments, dishId, onRefresh }: DishCommentsProps) {
  const [addOpen, setAddOpen] = useState(false);

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
          {comments.map((comment) => (
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
                </div>
                <span className="text-xs font-mono text-text-muted">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              <Markdown>{comment.content}</Markdown>
            </div>
          ))}
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
