import { Badge, Markdown } from "@/components/ui";
import { OwnerAvatar } from "@/components/the-pass/OwnerAvatar";
import { DishComments } from "./DishComments";
import { DishHistory } from "./DishHistory";
import { DISH_STATUSES, type Dish, type DishComment, type DishHistoryEntry } from "./types";
import { User, Bot, FolderOpen, Tag } from "lucide-react";

interface DishDetailProps {
  dish: Dish;
  comments: DishComment[];
  history: DishHistoryEntry[];
  onRefresh: () => void;
}

export function DishDetail({ dish, comments, history, onRefresh }: DishDetailProps) {
  const statusLabel = DISH_STATUSES.find((s) => s.key === dish.status)?.title ?? dish.status;
  const hasAssignee = !!dish.assignee;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-sm font-mono font-bold text-text-muted">{dish.ref}</span>
        <h3 className="text-2xl font-black">{dish.title}</h3>
        <p className="text-sm text-text-muted mt-1">
          {dish.customerName}{dish.customerSubtitle ? ` — ${dish.customerSubtitle}` : ""}
        </p>
      </div>

      {/* Status row */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="neutral" dot>{statusLabel}</Badge>
        <Badge variant="neutral">{dish.priority}</Badge>
        {dish.size && <Badge variant="neutral">{dish.size}</Badge>}
      </div>

      {/* Details grid */}
      <div className="border-4 border-black divide-y-2 divide-gray-light">
        {hasAssignee && (
          <div className="flex items-center gap-3 px-4 py-3">
            <User size={16} className="text-text-muted shrink-0" />
            <div>
              <p className="text-xs text-text-muted">Assignee</p>
              <div className="flex items-center gap-2 mt-0.5">
                <OwnerAvatar name={dish.assignee!} />
                <span className="text-sm font-semibold">{dish.assignee}</span>
              </div>
            </div>
          </div>
        )}

        {dish.agent && (
          <div className="flex items-center gap-3 px-4 py-3">
            <Bot size={16} className="text-text-muted shrink-0" />
            <div>
              <p className="text-xs text-text-muted">Agent</p>
              <p className="text-sm font-mono font-semibold">{dish.agent}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 px-4 py-3">
          <FolderOpen size={16} className="text-text-muted shrink-0" />
          <div>
            <p className="text-xs text-text-muted">Project</p>
            <p className="text-sm font-semibold">{dish.customerName}</p>
            {dish.customerSubtitle && <p className="text-xs text-text-muted">{dish.customerSubtitle}</p>}
          </div>
        </div>

        {dish.labels.length > 0 && (
          <div className="flex items-start gap-3 px-4 py-3">
            <Tag size={16} className="text-text-muted shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-text-muted mb-1">Labels</p>
              <div className="flex flex-wrap gap-1">
                {dish.labels.map((label) => (
                  <Badge key={label} variant="neutral">{label}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Markdown body */}
      {dish.body && (
        <div>
          <h4 className="font-extrabold text-sm mb-2">Description</h4>
          <div className="border-4 border-black p-4">
            <Markdown>{dish.body}</Markdown>
          </div>
        </div>
      )}

      {/* Comments */}
      <DishComments comments={comments} dishId={dish.id} onRefresh={onRefresh} />

      {/* History */}
      <DishHistory entries={history} />

      {/* Metadata */}
      <div className="text-xs text-text-muted font-mono">
        Dish #{dish.id} · Created {dish.createdAt.split("T")[0]} · Updated {dish.updatedAt.split("T")[0]}
      </div>
    </div>
  );
}
