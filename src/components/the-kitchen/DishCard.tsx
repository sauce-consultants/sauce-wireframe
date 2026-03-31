import { Badge, Card, CardBody } from "@/components/ui";
import { OwnerAvatar } from "@/components/the-pass/OwnerAvatar";
import type { Dish } from "./types";

interface DishCardProps {
  dish: Dish;
  onClick?: () => void;
}

export function DishCard({ dish, onClick }: DishCardProps) {
  const hasAssignee = !!dish.assignee;

  return (
    <Card
      className="transition-transform duration-150 hover:-translate-y-1 hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <CardBody className="p-4">
        {/* Title + size */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-extrabold text-sm leading-tight">{dish.title}</p>
          {dish.size && <Badge variant="neutral" className="shrink-0">{dish.size}</Badge>}
        </div>

        {/* Ref + project */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-mono font-bold">{dish.ref}</span>
          <span className="text-xs text-text-muted">
            {dish.customerName}{dish.customerSubtitle ? ` — ${dish.customerSubtitle}` : ""}
          </span>
        </div>

        {/* Assignee + agent + priority */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {hasAssignee && (
            <>
              <OwnerAvatar name={dish.assignee!} />
              <span className="text-xs">{dish.assignee}</span>
            </>
          )}
          {dish.agent && (
            <span className="text-xs font-mono text-text-muted border-2 border-gray-light px-1.5 py-0.5">
              {dish.agent}
            </span>
          )}
          <Badge variant="neutral">{dish.priority}</Badge>
        </div>

        {/* Labels */}
        {dish.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {dish.labels.map((label) => (
              <span key={label} className="text-xs font-mono text-text-muted border-2 border-gray-light px-1.5 py-0.5">
                {label}
              </span>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
