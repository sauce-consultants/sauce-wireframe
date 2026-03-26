"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface FloatingPosition {
  top: number;
  left: number;
  width: number;
}

function useFloating(open: boolean) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<FloatingPosition | null>(null);

  const update = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);

  useEffect(() => {
    if (open) update();
  }, [open, update]);

  return { triggerRef, pos };
}

export { useFloating, type FloatingPosition };
