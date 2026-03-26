interface ProgressBarProps {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  indeterminate?: boolean;
  variant?: "default" | "success" | "error";
  className?: string;
}

const fillColor = {
  default: "bg-black",
  success: "bg-success",
  error: "bg-danger",
};

function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = true,
  indeterminate = false,
  variant = "default",
  className = "",
}: ProgressBarProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm font-semibold">{label}</span>}
          {showValue && !indeterminate && (
            <span className="text-xs font-mono text-text-muted">{percent}%</span>
          )}
        </div>
      )}
      <div
        className="w-full h-3 bg-gray-light overflow-hidden"
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        {indeterminate ? (
          <div className={`h-full w-1/3 ${fillColor[variant]} animate-indeterminate`} />
        ) : (
          <div
            className={`h-full ${fillColor[variant]} transition-[width] duration-300`}
            style={{ width: `${percent}%` }}
          />
        )}
      </div>
    </div>
  );
}

export { ProgressBar, type ProgressBarProps };
