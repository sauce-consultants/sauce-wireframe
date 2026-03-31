import { Badge } from "@/components/ui";
import { DishCard } from "./DishCard";
import type { Dish } from "./types";

interface KitchenColumnProps {
  title: string;
  dishes: Dish[];
  onCardClick?: (dish: Dish) => void;
}

export function KitchenColumn({ title, dishes, onCardClick }: KitchenColumnProps) {
  return (
    <div className="flex flex-col min-w-[260px] snap-center">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="font-extrabold text-sm">{title}</h2>
        <Badge variant="neutral">{dishes.length}</Badge>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {dishes.length === 0 && (
          <div className="border-4 border-gray-light border-dashed p-6 text-center text-text-muted text-xs">
            No dishes
          </div>
        )}
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} onClick={() => onCardClick?.(dish)} />
        ))}
      </div>
    </div>
  );
}
