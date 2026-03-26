"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Portal } from "./portal";
import { useFloating } from "./use-floating";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  helperText,
  error,
  disabled = false,
  required = false,
  className = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const { triggerRef, pos } = useFloating(open);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = label.toLowerCase().replace(/\s+/g, "-") + "-list";

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, triggerRef]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault();
      setOpen(true);
      setHighlighted(options.findIndex((o) => o.value === value));
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (highlighted >= 0 && !options[highlighted].disabled) {
        onChange?.(options[highlighted].value);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className={className} ref={triggerRef}>
      <label className="block text-sm font-semibold mb-1.5">
        {label}
        {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
      </label>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && setOpen(!open)}
        className={`
          w-full h-12 border-4 ${error ? "border-danger" : "border-black"} bg-white
          px-3 text-left text-base flex items-center justify-between
          transition-colors
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
          disabled:opacity-50 disabled:pointer-events-none
        `}
      >
        <span className={selected ? "text-black" : "text-text-muted"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          size={20}
          className={`text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && pos && (
        <Portal>
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className="absolute z-dropdown border-4 border-black bg-white max-h-60 overflow-auto"
            style={{ top: pos.top + 4, left: pos.left, width: pos.width }}
          >
            {options.map((opt, i) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                aria-disabled={opt.disabled}
                className={`
                  px-3 py-2 text-sm cursor-pointer
                  ${i === highlighted ? "bg-gray-light" : ""}
                  ${opt.value === value ? "font-semibold" : ""}
                  ${opt.disabled ? "opacity-50 pointer-events-none" : "hover:bg-gray-light"}
                `}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => {
                  if (!opt.disabled) {
                    onChange?.(opt.value);
                    setOpen(false);
                  }
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </Portal>
      )}

      {(error || helperText) && (
        <p className={`text-sm mt-1.5 ${error ? "text-danger" : "text-text-muted"}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export { Select, type SelectProps, type SelectOption };
