"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "./icon-button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  destructive?: boolean;
}

function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-md",
  destructive = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      dialog.showModal();
    } else {
      dialog.close();
      previousFocus.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={`
        ${maxWidth} w-full p-0 border-4 ${destructive ? "border-danger" : "border-black"} bg-white shadow-lg
        backdrop:bg-black/50
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0
      `}
      aria-labelledby="modal-title"
    >
      <div className="flex items-center justify-between px-6 pt-5 pb-2">
        <h2 id="modal-title" className="text-xl font-extrabold">
          {title}
        </h2>
        <IconButton
          icon={<X size={20} />}
          aria-label="Close"
          variant="ghost"
          size="sm"
          onClick={onClose}
        />
      </div>
      <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">{children}</div>
      {footer && (
        <div className="flex items-center justify-end gap-3 px-6 pb-5 pt-2">
          {footer}
        </div>
      )}
    </dialog>
  );
}

export { Modal, type ModalProps };
