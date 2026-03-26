"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "./icon-button";

type SlideFrom = "right" | "left";

interface SlidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  from?: SlideFrom;
}

const translateClosed: Record<SlideFrom, string> = {
  right: "translate-x-full",
  left: "-translate-x-full",
};

const position: Record<SlideFrom, string> = {
  right: "right-0",
  left: "left-0",
};

function SlidePanel({
  open,
  onClose,
  title,
  children,
  footer,
  from = "right",
}: SlidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      panelRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      previousFocus.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-backdrop bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="slide-panel-title"
        tabIndex={-1}
        className={`
          fixed top-0 ${position[from]} bottom-0 z-modal
          w-full sm:max-w-md lg:max-w-lg
          bg-white border-l-4 border-black
          flex flex-col
          transition-transform duration-250 ease-out
          ${open ? "translate-x-0" : translateClosed[from]}
        `}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black shrink-0">
          <h2 id="slide-panel-title" className="text-xl font-extrabold">
            {title}
          </h2>
          <IconButton
            icon={<X size={20} />}
            aria-label="Close panel"
            variant="ghost"
            size="sm"
            onClick={onClose}
          />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t-4 border-black shrink-0">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}

export { SlidePanel, type SlidePanelProps };
