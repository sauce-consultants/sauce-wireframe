"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { KitchenHeader } from "@/components/kitchen-planner/KitchenHeader";
import { NewCustomerModal } from "./NewCustomerModal";

export function PassHeader() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <KitchenHeader
        action={
          <Button size="sm" leadingIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
            New Customer
          </Button>
        }
      />
      <NewCustomerModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
