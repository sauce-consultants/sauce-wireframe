"use client";

import { useState } from "react";
import { Badge } from "@/components/ui";
import { ChevronDown, User, Bot } from "lucide-react";
import type { DishHistoryEntry } from "./types";
import { formatRelativeTime } from "@/lib/relative-time";

interface DishHistoryProps {
  entries: DishHistoryEntry[];
}

function formatFieldChange(entry: DishHistoryEntry): string {
  if (entry.field === "body") return "Body updated";
  const old = entry.oldValue || "empty";
  const next = entry.newValue || "empty";
  return `${entry.field}: ${old} → ${next}`;
}

export function DishHistory({ entries }: DishHistoryProps) {
  const [expanded, setExpanded] = useState(false);

  if (entries.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 font-extrabold text-sm mb-3 hover:text-text-secondary transition-colors"
      >
        History
        <Badge variant="neutral">{entries.length}</Badge>
        <ChevronDown size={16} className={`text-text-muted transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-start gap-2 text-xs border-l-2 border-gray-light pl-3 py-1">
              {entry.changedByType === "human" ? (
                <User size={12} className="text-text-muted shrink-0 mt-0.5" />
              ) : (
                <Bot size={12} className="text-text-muted shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <span className="font-mono">{formatFieldChange(entry)}</span>
                <span className="text-text-muted"> — {entry.changedBy} · {formatRelativeTime(entry.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
