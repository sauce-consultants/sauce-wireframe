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
      // A CSS transform on an ancestor (e.g. dialog with translate) creates a
      // new containing block for position:fixed children. Offset accordingly.
      const dialog = triggerRef.current.closest("dialog");
      const ox = dialog ? dialog.getBoundingClientRect().left : 0;
      const oy = dialog ? dialog.getBoundingClientRect().top : 0;
      setPos({
        top: rect.bottom - oy,
        left: rect.left - ox,
        width: rect.width,
      });
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    update();

    // Reposition on any scroll (handles dropdowns inside scrollable containers like modals)
    const onScroll = () => update();
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [open, update]);

  return { triggerRef, pos };
}

export { useFloating, type FloatingPosition };
