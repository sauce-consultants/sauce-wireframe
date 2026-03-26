"use client";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  legend: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  variant?: "stacked" | "inline" | "card";
  className?: string;
}

function RadioGroup({
  legend,
  name,
  options,
  value,
  onChange,
  error,
  variant = "stacked",
  className = "",
}: RadioGroupProps) {
  const layoutClass =
    variant === "inline"
      ? "flex flex-wrap gap-6"
      : variant === "card"
        ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
        : "flex flex-col gap-3";

  return (
    <fieldset className={className}>
      <legend className="text-sm font-semibold mb-3">{legend}</legend>
      <div className={layoutClass}>
        {options.map((opt) => {
          const isSelected = opt.value === value;

          if (variant === "card") {
            return (
              <label
                key={opt.value}
                className={`
                  relative border-4 p-4 cursor-pointer transition-colors
                  ${isSelected ? "border-black bg-gray-light" : "border-gray-light hover:border-black"}
                  ${opt.disabled ? "opacity-50 pointer-events-none" : ""}
                `}
              >
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  disabled={opt.disabled}
                  onChange={() => onChange?.(opt.value)}
                  className="sr-only"
                />
                <span className="font-semibold text-sm">{opt.label}</span>
                {opt.description && (
                  <span className="block text-xs text-text-muted mt-1">
                    {opt.description}
                  </span>
                )}
              </label>
            );
          }

          return (
            <label
              key={opt.value}
              className={`flex items-start gap-3 cursor-pointer ${opt.disabled ? "opacity-50 pointer-events-none" : ""}`}
            >
              <span className="relative flex items-center justify-center h-6 w-6 shrink-0">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  disabled={opt.disabled}
                  onChange={() => onChange?.(opt.value)}
                  className="peer sr-only"
                />
                <span
                  className={`
                    h-6 w-6 rounded-full border-4 border-black
                    flex items-center justify-center
                    peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent
                  `}
                >
                  {isSelected && (
                    <span className="h-3 w-3 rounded-full bg-black" />
                  )}
                </span>
              </span>
              <div>
                <span className="text-base select-none">{opt.label}</span>
                {opt.description && (
                  <span className="block text-sm text-text-muted mt-0.5">
                    {opt.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
      {error && <p className="text-sm text-danger mt-2">{error}</p>}
    </fieldset>
  );
}

export { RadioGroup, type RadioGroupProps, type RadioOption };
