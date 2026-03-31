"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge, Button } from "@/components/ui";
import { X } from "lucide-react";
import type { ProjectOption } from "./types";

interface DishFiltersProps {
  projects: ProjectOption[];
}

export function DishFilters({ projects }: DishFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeIds = searchParams.getAll("table").map(Number);

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
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-text-muted">Tables:</span>
      {projects.map((p) => {
        const isActive = activeIds.includes(p.id);
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => toggleProject(p.id)}
            className={`text-xs font-semibold px-2 py-1 border-2 transition-colors ${
              isActive
                ? "border-black bg-black text-white"
                : "border-gray-light text-text-muted hover:border-black"
            }`}
          >
            {p.name}{p.subtitle ? ` — ${p.subtitle}` : ""}
          </button>
        );
      })}
      {activeIds.length > 0 && (
        <Button size="sm" variant="ghost" onClick={clearAll} leadingIcon={<X size={14} />}>
          Clear
        </Button>
      )}
    </div>
  );
}
