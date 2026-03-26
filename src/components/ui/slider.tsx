"use client";

interface SliderProps {
  label: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  className?: string;
}

function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  onChange,
  disabled = false,
  showValue = true,
  valuePrefix = "",
  valueSuffix = "",
  className = "",
}: SliderProps) {
  const inputId = label.toLowerCase().replace(/\s+/g, "-") + "-slider";
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={inputId} className="text-sm font-semibold">
          {label}
        </label>
        {showValue && (
          <span className="text-sm font-mono font-bold">
            {valuePrefix}{value}{valueSuffix}
          </span>
        )}
      </div>
      <div className="relative flex items-center h-8">
        {/* Track */}
        <div className="absolute w-full h-2 bg-gray-light">
          <div
            className="h-full bg-black"
            style={{ width: `${percent}%` }}
          />
        </div>
        {/* Native input */}
        <input
          type="range"
          id={inputId}
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(Number(e.target.value))}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${valuePrefix}${value}${valueSuffix}`}
          className="
            absolute w-full h-8 opacity-0 cursor-pointer
            disabled:cursor-not-allowed
          "
        />
        {/* Thumb visual */}
        <div
          className={`
            absolute h-6 w-6 bg-white border-4 border-black
            pointer-events-none
            ${disabled ? "opacity-50" : ""}
          `}
          style={{ left: `calc(${percent}% - 12px)` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs font-mono text-text-muted">{valuePrefix}{min}{valueSuffix}</span>
        <span className="text-xs font-mono text-text-muted">{valuePrefix}{max}{valueSuffix}</span>
      </div>
    </div>
  );
}

export { Slider, type SliderProps };
