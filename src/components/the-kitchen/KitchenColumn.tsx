import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Badge } from "@/components/ui";
import { DishCard } from "./DishCard";
import type { Dish, DishStatus } from "./types";

interface KitchenColumnProps {
  status: DishStatus;
  title: string;
  dishes: Dish[];
  onCardClick?: (dish: Dish) => void;
}

export function KitchenColumn({ status, title, dishes, onCardClick }: KitchenColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col min-w-[260px] snap-center">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="font-extrabold text-sm">{title}</h2>
        <Badge variant="neutral">{dishes.length}</Badge>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-3 flex-1 p-2 -m-2 transition-colors ${
          isOver ? "bg-gray-light/50" : ""
        }`}
      >
        <SortableContext items={dishes.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {dishes.length === 0 && (
            <div className="border-4 border-gray-light border-dashed p-6 text-center text-text-muted text-xs">
              No dishes
            </div>
          )}
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} onClick={() => onCardClick?.(dish)} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
