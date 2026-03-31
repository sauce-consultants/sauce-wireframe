"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge, Button } from "@/components/ui";
import { ChevronDown, X, Check } from "lucide-react";
import type { ProjectOption } from "./types";

interface DishFiltersProps {
  projects: ProjectOption[];
}

export function DishFilters({ projects }: DishFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeIds = searchParams.getAll("table").map(Number);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggleProject = (id: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("table");
    const next = activeIds.includes(id)
      ? activeIds.filter((t) => t !== id)
      : [...activeIds, id];
    next.forEach((t) => params.append("table", String(t)));
    router.push(`/the-kitchen?${params.toString()}`);
  };

  const clearAll = () => {
    router.push("/the-kitchen");
    setOpen(false);
  };

  const selectedNames = projects
    .filter((p) => activeIds.includes(p.id))
    .map((p) => p.shortCode || p.name);

  return (
    <div className="flex items-center gap-2" ref={containerRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="h-12 border-4 border-black bg-white px-4 text-sm font-semibold flex items-center gap-2 hover:bg-gray-light transition-colors"
        >
          <span>
            {activeIds.length === 0
              ? "All Tables"
              : `${activeIds.length} table${activeIds.length > 1 ? "s" : ""} selected`}
          </span>
          <ChevronDown size={16} className={`text-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute left-0 mt-1 w-72 border-4 border-black bg-white z-dropdown max-h-80 overflow-y-auto shadow-md">
            {/* Clear / select header */}
            {activeIds.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="w-full px-3 py-2 text-xs font-semibold text-text-muted hover:bg-gray-light text-left border-b-2 border-gray-light"
              >
                Clear all filters
              </button>
            )}

            {projects.map((p) => {
              const isSelected = activeIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProject(p.id)}
                  className={`w-full px-3 py-2.5 text-sm text-left flex items-center gap-2 transition-colors ${
                    isSelected ? "bg-gray-light font-semibold" : "hover:bg-gray-light/50"
                  }`}
                >
                  <span className={`h-4 w-4 border-2 border-black flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-black text-white" : ""
                  }`}>
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="flex-1 min-w-0 truncate">
                    {p.name}{p.subtitle ? ` — ${p.subtitle}` : ""}
                  </span>
                  {p.shortCode && (
                    <span className="text-xs font-mono text-text-muted shrink-0">{p.shortCode}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected badges */}
      {selectedNames.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {selectedNames.map((name) => (
            <Badge key={name} variant="neutral">{name}</Badge>
          ))}
          <button type="button" onClick={clearAll} className="text-text-muted hover:text-black">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
