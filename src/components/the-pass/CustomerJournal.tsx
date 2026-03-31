"use client";

import { useState } from "react";
import { Badge, Button } from "@/components/ui";
import { Plus, MessageSquare, Phone, Mail, RefreshCw, Users } from "lucide-react";
import { OwnerAvatar } from "./OwnerAvatar";
import { AddJournalModal } from "./AddJournalModal";
import { OWNERS, type JournalEntry, type EntryType } from "./types";
import { formatRelativeTime } from "@/lib/relative-time";

const typeConfig: Record<EntryType, { icon: React.ReactNode }> = {
  note: { icon: <MessageSquare size={12} /> },
  update: { icon: <RefreshCw size={12} /> },
  meeting: { icon: <Users size={12} /> },
  call: { icon: <Phone size={12} /> },
  email: { icon: <Mail size={12} /> },
};

interface CustomerJournalProps {
  entries: JournalEntry[];
  customerId: number;
  onRefresh: () => void;
}

export function CustomerJournal({ entries, customerId, onRefresh }: CustomerJournalProps) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold">Journal</h3>
        <Button size="sm" variant="secondary" leadingIcon={<Plus size={14} />} onClick={() => setAddOpen(true)}>
          Add Entry
        </Button>
      </div>

      {entries.length === 0 && (
        <div className="border-4 border-gray-light border-dashed p-6 text-center text-text-muted text-sm">
          No journal entries yet. Add the first one.
        </div>
      )}

      {entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry) => {
            const owner = OWNERS[entry.author];
            const type = entry.entryType ? typeConfig[entry.entryType] : null;

            return (
              <div key={entry.id} className="border-4 border-black p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <OwnerAvatar owner={entry.author} />
                    <span className="text-xs font-semibold">{owner.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {type && (
                      <Badge variant="neutral">{entry.entryType}</Badge>
                    )}
                    <span className="text-xs font-mono text-text-muted">
                      {formatRelativeTime(entry.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="text-sm whitespace-pre-wrap">{entry.content}</div>
              </div>
            );
          })}
        </div>
      )}

      <AddJournalModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        customerId={customerId}
        onAdded={onRefresh}
      />
    </div>
  );
}
