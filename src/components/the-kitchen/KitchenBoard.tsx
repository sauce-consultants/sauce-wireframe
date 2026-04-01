"use client";

import { useState, useEffect, useCallback, useId, useMemo } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import { useSession } from "next-auth/react";
import { SlidePanel, Button } from "@/components/ui";
import { KitchenColumn } from "./KitchenColumn";
import { DishCard } from "./DishCard";
import { DishDetail } from "./DishDetail";
import { DishFilters } from "./DishFilters";
import { EditDishModal } from "./EditDishModal";
import { DISH_STATUSES, type KitchenBoard as KitchenBoardData, type Dish, type DishStatus, type DishComment, type DishHistoryEntry, type ProjectOption } from "./types";
import { moveDish } from "@/app/the-kitchen/actions";
import { Edit, Search } from "lucide-react";

interface KitchenBoardProps {
  data: KitchenBoardData;
  projects: ProjectOption[];
  users: { id: number; name: string }[];
}

export function KitchenBoard({ data: serverData, projects, users }: KitchenBoardProps) {
  const dndId = useId();
  const { data: session } = useSession();
  const [board, setBoard] = useState<KitchenBoardData>(serverData);
  const [activeDish, setActiveDish] = useState<Dish | null>(null);
  const [selected, setSelected] = useState<Dish | null>(null);
  const [editing, setEditing] = useState(false);
  const [comments, setComments] = useState<DishComment[]>([]);
  const [history, setHistory] = useState<DishHistoryEntry[]>([]);
  const [search, setSearch] = useState("");

  // Sync server data when it changes (e.g. after revalidation)
  useEffect(() => {
    setBoard(serverData);
  }, [serverData]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const dishId = event.active.id as number;
    for (const status of DISH_STATUSES) {
      const found = board[status.key].find((d) => d.id === dishId);
      if (found) { setActiveDish(found); return; }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveDish(null);
    const { active, over } = event;
    if (!over) return;

    const dishId = active.id as number;

    // Resolve target column — over.id could be a column status or a dish ID
    const statusKeys = DISH_STATUSES.map((s) => s.key as string);
    let newStatus: DishStatus;
    if (statusKeys.includes(over.id as string)) {
      newStatus = over.id as DishStatus;
    } else {
      // Dropped on a card — find which column that card belongs to
      const targetDishId = over.id as number;
      let found = false;
      newStatus = "backlog";
      for (const status of DISH_STATUSES) {
        if (board[status.key].some((d) => d.id === targetDishId)) {
          newStatus = status.key;
          found = true;
          break;
        }
      }
      if (!found) return;
    }

    // Find the source dish and its current status
    let sourceDish: Dish | null = null;
    let sourceStatus: DishStatus | null = null;
    for (const status of DISH_STATUSES) {
      const found = board[status.key].find((d) => d.id === dishId);
      if (found) {
        sourceDish = found;
        sourceStatus = status.key;
        break;
      }
    }

    if (!sourceDish || !sourceStatus || sourceStatus === newStatus) return;

    // Optimistic update
    setBoard((prev) => {
      const next = { ...prev };
      next[sourceStatus] = prev[sourceStatus].filter((d) => d.id !== dishId);
      next[newStatus] = [...prev[newStatus], { ...sourceDish!, status: newStatus }];
      return next;
    });

    // Persist
    const result = await moveDish(dishId, newStatus, session?.user?.name || "Unknown");
    if (result.error) {
      // Revert on failure
      setBoard(serverData);
    }
  };

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

  const filteredBoard = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return board;
    const filtered: KitchenBoardData = { backlog: [], todo: [], in_progress: [], review: [], done: [] };
    for (const status of DISH_STATUSES) {
      filtered[status.key] = board[status.key].filter((d) =>
        d.title.toLowerCase().includes(q) ||
        d.ref.toLowerCase().includes(q) ||
        d.customerName.toLowerCase().includes(q) ||
        (d.assignee && d.assignee.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [board, search]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <DishFilters projects={projects} />
        <div className="relative max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full border-4 border-black bg-white pl-9 pr-4 text-sm font-semibold placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
      </div>

      <DndContext id={dndId} sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible lg:snap-none">
          {DISH_STATUSES.map((status) => (
            <KitchenColumn
              key={status.key}
              status={status.key}
              title={status.title}
              dishes={filteredBoard[status.key]}
              onCardClick={setSelected}
            />
          ))}
        </div>
        <DragOverlay>
          {activeDish && <DishCard dish={activeDish} />}
        </DragOverlay>
      </DndContext>

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

      {selected && (
        <EditDishModal
          open={editing}
          onClose={() => { setEditing(false); setSelected(null); }}
          dish={selected}
          projects={projects}
          users={users}
        />
      )}
    </div>
  );
}
