"use client";

interface ToggleProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  statusText?: boolean;
  className?: string;
}

function Toggle({
  label,
  checked = false,
  onChange,
  disabled = false,
  statusText = false,
  className = "",
}: ToggleProps) {
  const inputId = label.toLowerCase().replace(/\s+/g, "-") + "-toggle";

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <label htmlFor={inputId} className="text-base cursor-pointer select-none">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {statusText && (
          <span className="text-xs font-mono text-text-muted w-6">
            {checked ? "On" : "Off"}
          </span>
        )}
        <label htmlFor={inputId} className="relative cursor-pointer">
          <input
            type="checkbox"
            role="switch"
            id={inputId}
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.checked)}
            className="peer sr-only"
            aria-checked={checked}
          />
          <span
            className={`
              block h-8 w-14 border-4 border-black transition-colors
              ${checked ? "bg-black" : "bg-gray-light"}
              peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent
              peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
            `}
          />
          <span
            className={`
              absolute top-1 h-6 w-6 bg-white border-2 border-black
              transition-transform
              ${checked ? "translate-x-6" : "translate-x-0"}
            `}
            style={{ left: "4px" }}
          />
        </label>
      </div>
    </div>
  );
}

export { Toggle, type ToggleProps };
