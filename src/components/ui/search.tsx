"use client";

import { useState, useRef, useEffect } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Portal } from "./portal";
import { useFloating } from "./use-floating";

interface SearchResult {
  id: string;
  label: string;
  description?: string;
  category?: string;
}

interface SearchProps {
  placeholder?: string;
  results?: SearchResult[];
  onSearch?: (query: string) => void;
  onSelect?: (result: SearchResult) => void;
  loading?: boolean;
  className?: string;
}

function Search({
  placeholder = "Search...",
  results = [],
  onSearch,
  onSelect,
  loading = false,
  className = "",
}: SearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const { triggerRef, pos } = useFloating(open);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, triggerRef]);

  const handleChange = (value: string) => {
    setQuery(value);
    setHighlighted(0);
    setOpen(true);
    onSearch?.(value);
  };

  const clear = () => {
    setQuery("");
    setOpen(false);
    onSearch?.("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && results[highlighted]) {
      e.preventDefault();
      onSelect?.(results[highlighted]);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showPanel = open && query.length > 0;

  return (
    <div className={className} ref={triggerRef}>
      <div className="relative flex items-center">
        <SearchIcon size={18} className="absolute left-3 text-text-muted pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showPanel}
          aria-autocomplete="list"
          aria-label="Search"
          value={query}
          placeholder={placeholder}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => query && setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full h-12 border-4 border-black bg-white pl-10 pr-10 text-base placeholder:text-text-muted focus:outline-none focus:border-accent"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-3 text-text-muted hover:text-black"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showPanel && pos && (
        <Portal>
          <div
            ref={panelRef}
            className="absolute z-dropdown border-4 border-black bg-white max-h-80 overflow-y-auto shadow-md"
            style={{ top: pos.top + 4, left: pos.left, width: pos.width }}
          >
            {loading && (
              <div className="px-4 py-6 text-sm text-text-muted text-center">Searching...</div>
            )}
            {!loading && results.length === 0 && (
              <div className="px-4 py-6 text-sm text-text-muted text-center">
                No results for &ldquo;{query}&rdquo;
              </div>
            )}
            {!loading && results.length > 0 && (
              <ul role="listbox">
                {results.map((r, i) => (
                  <li
                    key={r.id}
                    role="option"
                    aria-selected={i === highlighted}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer text-sm ${
                      i === highlighted ? "bg-gray-light" : "hover:bg-gray-light"
                    }`}
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => {
                      onSelect?.(r);
                      setOpen(false);
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{r.label}</p>
                      {r.description && (
                        <p className="text-xs text-text-muted truncate">{r.description}</p>
                      )}
                    </div>
                    {r.category && (
                      <span className="text-xs font-mono text-text-muted shrink-0">{r.category}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Portal>
      )}
    </div>
  );
}

export { Search, type SearchProps, type SearchResult };
