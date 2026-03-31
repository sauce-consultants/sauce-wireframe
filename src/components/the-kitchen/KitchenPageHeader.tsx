"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { KitchenHeader } from "@/components/kitchen-planner/KitchenHeader";
import { NewDishModal } from "./NewDishModal";
import type { ProjectOption } from "./types";

interface KitchenPageHeaderProps {
  projects: ProjectOption[];
}

export function KitchenPageHeader({ projects }: KitchenPageHeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <KitchenHeader
        action={
          <Button size="sm" leadingIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
            New Dish
          </Button>
        }
      />
      <NewDishModal open={modalOpen} onClose={() => setModalOpen(false)} projects={projects} />
    </>
  );
}
