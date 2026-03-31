"use client";

import { useState, useEffect, useCallback, useId } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import { SlidePanel, Button } from "@/components/ui";
import { PassColumn } from "./PassColumn";
import { PassTicket } from "./PassTicket";
import { CustomerDetail } from "./CustomerDetail";
import { EditCustomerModal } from "./EditCustomerModal";
import { STAGES, type BoardData, type Customer, type Stage, type JournalEntry } from "./types";
import { moveCustomer } from "@/app/the-pass/actions";
import { Edit } from "lucide-react";

interface PassBoardProps {
  data: BoardData;
  users: { id: number; name: string }[];
}

export function PassBoard({ data: serverData, users }: PassBoardProps) {
  const dndId = useId();
  const [board, setBoard] = useState<BoardData>(serverData);
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [editing, setEditing] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setBoard(serverData);
  }, [serverData]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as number;
    for (const stage of STAGES) {
      const found = board[stage.key].find((c) => c.id === id);
      if (found) { setActiveCustomer(found); return; }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveCustomer(null);
    const { active, over } = event;
    if (!over) return;

    const customerId = active.id as number;
    // Resolve target column — over.id could be a column stage or a customer ID
    const stageKeys = STAGES.map((s) => s.key as string);
    let newStage: Stage;
    if (stageKeys.includes(over.id as string)) {
      newStage = over.id as Stage;
    } else {
      const targetId = over.id as number;
      let found = false;
      newStage = "enquiry";
      for (const stage of STAGES) {
        if (board[stage.key].some((c) => c.id === targetId)) {
          newStage = stage.key;
          found = true;
          break;
        }
      }
      if (!found) return;
    }

    let sourceCustomer: Customer | null = null;
    let sourceStage: Stage | null = null;
    for (const stage of STAGES) {
      const found = board[stage.key].find((c) => c.id === customerId);
      if (found) {
        sourceCustomer = found;
        sourceStage = stage.key;
        break;
      }
    }

    if (!sourceCustomer || !sourceStage || sourceStage === newStage) return;

    // Optimistic update
    setBoard((prev) => {
      const next = { ...prev };
      next[sourceStage] = prev[sourceStage].filter((c) => c.id !== customerId);
      next[newStage] = [...prev[newStage], { ...sourceCustomer!, stage: newStage }];
      return next;
    });

    const result = await moveCustomer(customerId, newStage);
    if (result.error) {
      setBoard(serverData);
    }
  };

  const fetchJournal = useCallback(async (customerId: number) => {
    const res = await fetch(`/api/the-pass/journal?customerId=${customerId}`);
    if (res.ok) {
      const entries = await res.json();
      setJournalEntries(entries);
    }
  }, []);

  useEffect(() => {
    if (selected) {
      fetchJournal(selected.id);
    } else {
      setJournalEntries([]);
    }
  }, [selected, fetchJournal]);

  const handleJournalRefresh = () => {
    if (selected) fetchJournal(selected.id);
  };

  return (
    <div>
      {/* Heat legend */}
      <div className="flex items-center gap-3 mb-4 justify-end text-xs text-text-muted">
        <span className="flex items-center gap-1"><span className="h-2 w-2 bg-black" /> Hot</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 bg-gray-dark" /> Warm</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 bg-gray-mid" /> Cool</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 bg-gray-light" /> Cold</span>
      </div>

      <DndContext id={dndId} sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible lg:snap-none">
          {STAGES.map((stage) => (
            <PassColumn
              key={stage.key}
              stage={stage.key}
              title={stage.title}
              subtitle={stage.subtitle}
              customers={board[stage.key]}
              onCardClick={setSelected}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCustomer && <PassTicket customer={activeCustomer} />}
        </DragOverlay>
      </DndContext>

      <SlidePanel
        open={!!selected && !editing}
        onClose={() => setSelected(null)}
        title={selected?.companyName ?? ""}
        footer={
          <Button variant="secondary" leadingIcon={<Edit size={16} />} onClick={() => setEditing(true)}>
            Edit Customer
          </Button>
        }
      >
        {selected && (
          <CustomerDetail
            customer={selected}
            journalEntries={journalEntries}
            users={users}
            onJournalRefresh={handleJournalRefresh}
          />
        )}
      </SlidePanel>

      {selected && (
        <EditCustomerModal
          open={editing}
          onClose={() => { setEditing(false); setSelected(null); }}
          customer={selected}
          users={users}
        />
      )}
    </div>
  );
}
