"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { Badge } from "./badge";
import { Portal } from "./portal";
import { useFloating } from "./use-floating";

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  label: string;
  options: ComboboxOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

function Combobox({
  label,
  options,
  value,
  onChange,
  placeholder = "Search...",
  multiple = false,
  error,
  helperText,
  disabled = false,
  required = false,
  className = "",
}: ComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const { triggerRef, pos } = useFloating(open);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedValues = multiple
    ? (Array.isArray(value) ? value : [])
    : [];
  const singleValue = !multiple && typeof value === "string" ? value : undefined;

  const filtered = options.filter(
    (o) =>
      o.label.toLowerCase().includes(query.toLowerCase()) &&
      (!multiple || !selectedValues.includes(o.value))
  );

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

  const selectOption = (opt: ComboboxOption) => {
    if (multiple) {
      onChange?.([...selectedValues, opt.value]);
      setQuery("");
    } else {
      onChange?.(opt.value);
      setQuery(opt.label);
      setOpen(false);
    }
    inputRef.current?.focus();
  };

  const removeTag = (val: string) => {
    onChange?.(selectedValues.filter((v) => v !== val));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && open && filtered[highlighted]) {
      e.preventDefault();
      selectOption(filtered[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Backspace" && !query && multiple && selectedValues.length > 0) {
      removeTag(selectedValues[selectedValues.length - 1]);
    }
  };

  const showDropdown = open && (filtered.length > 0 || (query && filtered.length === 0));

  return (
    <div className={className} ref={triggerRef}>
      <label className="block text-sm font-semibold mb-1.5">
        {label}
        {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
      </label>
      <div
        className={`
          flex flex-wrap items-center gap-1.5 border-4
          ${error ? "border-danger" : "border-black"} bg-white px-3 min-h-12
          ${disabled ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        {multiple &&
          selectedValues.map((v) => {
            const opt = options.find((o) => o.value === v);
            return (
              <Badge key={v} variant="neutral" onRemove={() => removeTag(v)}>
                {opt?.label || v}
              </Badge>
            );
          })}
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          value={query}
          disabled={disabled}
          placeholder={
            multiple && selectedValues.length > 0 ? "" : placeholder
          }
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlighted(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-20 py-2 outline-none bg-transparent text-base placeholder:text-text-muted"
        />
        {!multiple && singleValue && (
          <button
            type="button"
            onClick={() => {
              onChange?.("");
              setQuery("");
              inputRef.current?.focus();
            }}
            className="text-text-muted hover:text-black"
            aria-label="Clear selection"
          >
            <X size={18} />
          </button>
        )}
        <ChevronDown
          size={18}
          className={`text-text-muted shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {showDropdown && pos && (
        <Portal>
          <div
            ref={listRef}
            className="absolute z-dropdown border-4 border-black bg-white max-h-60 overflow-auto"
            style={{ top: pos.top + 4, left: pos.left, width: pos.width }}
          >
            {filtered.length > 0 ? (
              <ul>
                {filtered.map((opt, i) => (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={opt.value === singleValue}
                    className={`
                      px-3 py-2 text-sm cursor-pointer
                      ${i === highlighted ? "bg-gray-light" : "hover:bg-gray-light"}
                      ${opt.value === singleValue ? "font-semibold" : ""}
                    `}
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => selectOption(opt)}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-4 text-sm text-text-muted text-center">
                No results for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
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

export { Combobox, type ComboboxProps, type ComboboxOption };
