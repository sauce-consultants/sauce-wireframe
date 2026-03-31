"use client";

import { useState, useEffect, useCallback } from "react";
import { SlidePanel, Button } from "@/components/ui";
import { KitchenColumn } from "./KitchenColumn";
import { DishDetail } from "./DishDetail";
import { DishFilters } from "./DishFilters";
import { EditDishModal } from "./EditDishModal";
import { DISH_STATUSES, type KitchenBoard as KitchenBoardData, type Dish, type DishComment, type DishHistoryEntry, type ProjectOption } from "./types";
import { Edit } from "lucide-react";

interface KitchenBoardProps {
  data: KitchenBoardData;
  projects: ProjectOption[];
}

export function KitchenBoard({ data, projects }: KitchenBoardProps) {
  const [selected, setSelected] = useState<Dish | null>(null);
  const [editing, setEditing] = useState(false);
  const [comments, setComments] = useState<DishComment[]>([]);
  const [history, setHistory] = useState<DishHistoryEntry[]>([]);

  const fetchDishData = useCallback(async (dishId: number) => {
    const res = await fetch(`/api/the-kitchen/${dishId}`);
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments);
      setHistory(data.history);
    }
  }, []);

  useEffect(() => {
    if (selected) {
      fetchDishData(selected.id);
    } else {
      setComments([]);
      setHistory([]);
    }
  }, [selected, fetchDishData]);

  const handleRefresh = () => {
    if (selected) fetchDishData(selected.id);
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-4">
        <DishFilters projects={projects} />
      </div>

      {/* Board columns */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible lg:snap-none">
        {DISH_STATUSES.map((status) => (
          <KitchenColumn
            key={status.key}
            title={status.title}
            dishes={data[status.key]}
            onCardClick={setSelected}
          />
        ))}
      </div>

      {/* Detail drawer */}
      <SlidePanel
        open={!!selected && !editing}
        onClose={() => setSelected(null)}
        title={selected?.title ?? ""}
        footer={
          <Button variant="secondary" leadingIcon={<Edit size={16} />} onClick={() => setEditing(true)}>
            Edit Dish
          </Button>
        }
      >
        {selected && (
          <DishDetail
            dish={selected}
            comments={comments}
            history={history}
            onRefresh={handleRefresh}
          />
        )}
      </SlidePanel>

      {/* Edit modal */}
      {selected && (
        <EditDishModal
          open={editing}
          onClose={() => { setEditing(false); setSelected(null); }}
          dish={selected}
          projects={projects}
        />
      )}
    </div>
  );
}
