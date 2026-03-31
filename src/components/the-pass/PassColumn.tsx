import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Badge } from "@/components/ui";
import { PassTicket } from "./PassTicket";
import type { Customer, Heat, Stage } from "./types";

const heatDot: Record<Heat, string> = {
  hot: "bg-black",
  warm: "bg-gray-dark",
  cool: "bg-gray-mid",
  cold: "bg-gray-light",
};

interface PassColumnProps {
  stage: Stage;
  title: string;
  subtitle: string;
  customers: Customer[];
  onCardClick?: (customer: Customer) => void;
}

export function PassColumn({ stage, title, subtitle, customers, onCardClick }: PassColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  const columnHeat = customers.reduce<Heat | null>((hottest, c) => {
    const order: Heat[] = ["hot", "warm", "cool", "cold"];
    if (!hottest) return c.heat;
    return order.indexOf(c.heat) < order.indexOf(hottest) ? c.heat : hottest;
  }, null);

  return (
    <div className="flex flex-col min-w-[280px] snap-center">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-sm">{title}</h2>
            <Badge variant="neutral">{customers.length}</Badge>
          </div>
          <p className="text-xs text-text-muted">{subtitle}</p>
        </div>
        {columnHeat && (
          <span className={`h-2.5 w-2.5 rounded-full ${heatDot[columnHeat]} shrink-0 mt-1.5`} />
        )}
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-3 flex-1 p-2 -m-2 transition-colors ${
          isOver ? "bg-gray-light/50" : ""
        }`}
      >
        <SortableContext items={customers.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {customers.length === 0 && (
            <div className="border-4 border-gray-light border-dashed p-6 text-center text-text-muted text-xs">
              Nothing here yet
            </div>
          )}
          {customers.map((customer) => (
            <PassTicket key={customer.id} customer={customer} onClick={() => onCardClick?.(customer)} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
