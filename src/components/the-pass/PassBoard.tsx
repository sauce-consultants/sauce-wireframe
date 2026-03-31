"use client";

import { useState, useEffect, useCallback } from "react";
import { SlidePanel, Button } from "@/components/ui";
import { PassColumn } from "./PassColumn";
import { CustomerDetail } from "./CustomerDetail";
import { EditCustomerModal } from "./EditCustomerModal";
import { STAGES, type BoardData, type Customer, type JournalEntry } from "./types";
import { Edit } from "lucide-react";

interface PassBoardProps {
  data: BoardData;
  users: { id: number; name: string }[];
}

export function PassBoard({ data, users }: PassBoardProps) {
  const [selected, setSelected] = useState<Customer | null>(null);
  const [editing, setEditing] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

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

  const handleCardClick = (customer: Customer) => {
    setSelected(customer);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleEditClose = () => {
    setEditing(false);
    setSelected(null);
  };

  const handleJournalRefresh = () => {
    if (selected) {
      fetchJournal(selected.id);
    }
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

      {/* Board columns */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible lg:snap-none">
        {STAGES.map((stage) => (
          <PassColumn
            key={stage.key}
            title={stage.title}
            subtitle={stage.subtitle}
            customers={data[stage.key]}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      {/* Detail drawer */}
      <SlidePanel
        open={!!selected && !editing}
        onClose={() => setSelected(null)}
        title={selected?.companyName ?? ""}
        footer={
          <Button variant="secondary" leadingIcon={<Edit size={16} />} onClick={handleEdit}>
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

      {/* Edit modal */}
      {selected && (
        <EditCustomerModal
          open={editing}
          onClose={handleEditClose}
          customer={selected}
          users={users}
        />
      )}
    </div>
  );
}
